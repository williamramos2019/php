
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowRightLeft, Camera, FileText, Calendar, User, AlertTriangle, CheckCircle, Clock, Download } from "lucide-react";
import type { EquipmentSubstitution } from "../types";

interface SubstitutionHistoryProps {
  rentalId: string;
  equipmentName: string;
}

export function SubstitutionHistory({ rentalId, equipmentName }: SubstitutionHistoryProps) {
  const [selectedSubstitution, setSelectedSubstitution] = useState<EquipmentSubstitution | null>(null);

  const { data: substitutions, isLoading } = useQuery<EquipmentSubstitution[]>({
    queryKey: [`/api/equipment-substitutions/rental/${rentalId}`],
  });

  const formatDateTime = (date: Date | string) => {
    return new Date(date).toLocaleString("pt-BR");
  };

  const getReasonIcon = (reason: string) => {
    switch (reason) {
      case "defect": return <AlertTriangle className="text-red-500" size={16} />;
      case "damage": return <AlertTriangle className="text-orange-500" size={16} />;
      case "upgrade": return <CheckCircle className="text-green-500" size={16} />;
      case "maintenance": return <Clock className="text-blue-500" size={16} />;
      default: return <ArrowRightLeft className="text-gray-500" size={16} />;
    }
  };

  const getReasonLabel = (reason: string) => {
    const labels = {
      "defect": "Defeito",
      "damage": "Dano",
      "upgrade": "Upgrade",
      "maintenance": "Manutenção",
      "wear": "Desgaste Normal"
    };
    return labels[reason as keyof typeof labels] || reason;
  };

  const downloadReport = async (substitutionId: string) => {
    try {
      const response = await fetch(`/api/equipment-substitutions/${substitutionId}/report`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `relatorio-substituicao-${substitutionId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading report:", error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft size={20} />
            Histórico de Substituições
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Carregando histórico...</div>
        </CardContent>
      </Card>
    );
  }

  if (!substitutions || substitutions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft size={20} />
            Histórico de Substituições
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <ArrowRightLeft size={48} className="mx-auto mb-2 opacity-20" />
            <p>Nenhuma substituição registrada para este equipamento</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRightLeft size={20} />
          Histórico de Substituições ({substitutions.length})
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Equipamento Original: <strong>{equipmentName}</strong>
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Timeline View */}
          <div className="relative">
            {substitutions.map((substitution, index) => (
              <div key={substitution.id} className="flex items-start space-x-4 pb-6">
                {/* Timeline connector */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    {getReasonIcon(substitution.substitutionReason)}
                  </div>
                  {index < substitutions.length - 1 && (
                    <div className="w-0.5 h-12 bg-gray-200 mt-2"></div>
                  )}
                </div>

                {/* Substitution details */}
                <div className="flex-1 min-w-0">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          Substituição #{index + 1}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatDateTime(substitution.substitutionDate)}
                        </span>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedSubstitution(substitution)}
                          >
                            <FileText size={14} className="mr-1" />
                            Detalhes
                          </Button>
                        </DialogTrigger>
                      </Dialog>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">De:</p>
                        <p className="font-medium text-red-600">
                          {substitution.oldEquipmentName}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Para:</p>
                        <p className="font-medium text-green-600">
                          {substitution.newEquipmentName}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Motivo:</p>
                        <div className="flex items-center gap-1">
                          {getReasonIcon(substitution.substitutionReason)}
                          <span>{getReasonLabel(substitution.substitutionReason)}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Responsável:</p>
                        <p className="font-medium">{substitution.supplierResponsible}</p>
                      </div>
                    </div>

                    {substitution.responsibilityShift && (
                      <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                        <div className="flex items-center gap-1 text-yellow-700">
                          <AlertTriangle size={14} />
                          <span className="text-sm font-medium">
                            Transferência de Responsabilidade
                          </span>
                        </div>
                        {substitution.additionalCosts && (
                          <p className="text-sm text-yellow-600 mt-1">
                            Custos adicionais: R$ {substitution.additionalCosts}
                          </p>
                        )}
                      </div>
                    )}

                    {(substitution.deliveryPhotos?.length > 0 || substitution.receiptPhotos?.length > 0) && (
                      <div className="mt-2 flex items-center gap-1 text-blue-600">
                        <Camera size={14} />
                        <span className="text-sm">
                          {(substitution.deliveryPhotos?.length || 0) + (substitution.receiptPhotos?.length || 0)} foto(s) anexada(s)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Table View */}
          <div className="mt-8">
            <h4 className="font-medium mb-4">Tabela Completa de Substituições</h4>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Seq</TableHead>
                    <TableHead>Equipamento Saindo</TableHead>
                    <TableHead>Equipamento Recebido</TableHead>
                    <TableHead>Data da Troca</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {substitutions.map((substitution, index) => (
                    <TableRow key={substitution.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="text-red-600">
                        {substitution.oldEquipmentName}
                      </TableCell>
                      <TableCell className="text-green-600">
                        {substitution.newEquipmentName}
                      </TableCell>
                      <TableCell>
                        {formatDateTime(substitution.substitutionDate)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getReasonIcon(substitution.substitutionReason)}
                          <span>{getReasonLabel(substitution.substitutionReason)}</span>
                        </div>
                      </TableCell>
                      <TableCell>{substitution.supplierResponsible}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadReport(substitution.id)}
                        >
                          <Download size={14} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Detailed View Dialog */}
      {selectedSubstitution && (
        <Dialog open={!!selectedSubstitution} onOpenChange={() => setSelectedSubstitution(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes da Substituição</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Equipamento Original</label>
                  <p className="text-lg font-medium text-red-600">{selectedSubstitution.oldEquipmentName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Novo Equipamento</label>
                  <p className="text-lg font-medium text-green-600">{selectedSubstitution.newEquipmentName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Data da Substituição</label>
                  <p className="flex items-center gap-1">
                    <Calendar size={16} />
                    {formatDateTime(selectedSubstitution.substitutionDate)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Responsável da Locadora</label>
                  <p className="flex items-center gap-1">
                    <User size={16} />
                    {selectedSubstitution.supplierResponsible}
                  </p>
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Motivo da Substituição</label>
                <div className="flex items-center gap-2 mt-1">
                  {getReasonIcon(selectedSubstitution.substitutionReason)}
                  <span className="font-medium">{getReasonLabel(selectedSubstitution.substitutionReason)}</span>
                </div>
              </div>

              {/* Notes */}
              {selectedSubstitution.notes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Suas Observações</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded border">
                    {selectedSubstitution.notes}
                  </div>
                </div>
              )}

              {selectedSubstitution.supplierNotes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Observações da Locadora</label>
                  <div className="mt-1 p-3 bg-blue-50 rounded border border-blue-200">
                    {selectedSubstitution.supplierNotes}
                  </div>
                </div>
              )}

              {/* Responsibility Shift */}
              {selectedSubstitution.responsibilityShift && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                  <h4 className="font-medium text-yellow-800 flex items-center gap-2">
                    <AlertTriangle size={16} />
                    Transferência de Responsabilidade
                  </h4>
                  <p className="text-yellow-700 mt-1">
                    Houve transferência de custos/responsabilidade para você nesta substituição.
                  </p>
                  {selectedSubstitution.additionalCosts && (
                    <p className="text-yellow-800 font-medium mt-2">
                      Custos adicionais: R$ {selectedSubstitution.additionalCosts}
                    </p>
                  )}
                </div>
              )}

              {/* Photos */}
              {(selectedSubstitution.deliveryPhotos?.length > 0 || selectedSubstitution.receiptPhotos?.length > 0) && (
                <div className="space-y-4">
                  {selectedSubstitution.deliveryPhotos?.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Fotos da Entrega</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                        {selectedSubstitution.deliveryPhotos.map((photo, index) => (
                          <div key={index} className="bg-gray-100 p-2 rounded text-xs">
                            <a href={photo} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              📷 Foto {index + 1}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedSubstitution.receiptPhotos?.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Fotos do Recebimento</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                        {selectedSubstitution.receiptPhotos.map((photo, index) => (
                          <div key={index} className="bg-gray-100 p-2 rounded text-xs">
                            <a href={photo} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              📷 Foto {index + 1}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end">
                <Button onClick={() => downloadReport(selectedSubstitution.id)}>
                  <Download size={16} className="mr-2" />
                  Baixar Relatório PDF
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
