import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft, Download, Filter, Calendar, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import type { EquipmentSubstitution, RentalWithDetails, Supplier } from "../types";
import { SubstitutionHistory } from "@/components/substitution-history";

interface SubstitutionWithDetails extends EquipmentSubstitution {
  rental: RentalWithDetails;
}

export default function SubstitutionReports() {
  const [filters, setFilters] = useState({
    supplier: "",
    reason: "",
    startDate: "",
    endDate: "",
    responsibilityShift: false,
  });

  const { data: substitutions, isLoading } = useQuery<SubstitutionWithDetails[]>({
    queryKey: ["/api/equipment-substitutions"],
  });

  const { data: suppliers } = useQuery<Supplier[]>({
    queryKey: ["/api/suppliers"],
  });

  const formatDateTime = (date: Date | string) => {
    return new Date(date).toLocaleString("pt-BR");
  };

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(parseFloat(value));
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

  const filteredSubstitutions = substitutions?.filter((substitution) => {
    if (filters.supplier && !substitution.rental.supplier?.name?.toLowerCase().includes(filters.supplier.toLowerCase())) return false;
    if (filters.reason && substitution.substitutionReason !== filters.reason) return false;
    if (filters.startDate && new Date(substitution.substitutionDate) < new Date(filters.startDate)) return false;
    if (filters.endDate && new Date(substitution.substitutionDate) > new Date(filters.endDate)) return false;
    if (filters.responsibilityShift && !substitution.responsibilityShift) return false;
    return true;
  });

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

  const exportToCSV = () => {
    if (!filteredSubstitutions) return;

    const csvContent = [
      ["Data", "Fornecedor", "Equipamento Original", "Novo Equipamento", "Motivo", "Responsável", "Custos Adicionais", "Transferência Responsabilidade"],
      ...filteredSubstitutions.map(substitution => [
        formatDateTime(substitution.substitutionDate),
        substitution.rental.supplier.name,
        substitution.oldEquipmentName,
        substitution.newEquipmentName,
        getReasonLabel(substitution.substitutionReason),
        substitution.supplierResponsible,
        substitution.additionalCosts || "0",
        substitution.responsibilityShift ? "Sim" : "Não",
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "relatorio-substituicoes.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Statistics
  const stats = {
    total: filteredSubstitutions?.length || 0,
    withCosts: filteredSubstitutions?.filter(s => s.responsibilityShift).length || 0,
    totalCosts: filteredSubstitutions?.reduce((sum, s) => sum + parseFloat(s.additionalCosts || "0"), 0) || 0,
    topReason: filteredSubstitutions?.reduce((acc, s) => {
      acc[s.substitutionReason] = (acc[s.substitutionReason] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };

  const topReason = stats.topReason ? Object.entries(stats.topReason).sort(([,a], [,b]) => b - a)[0] : null;

  return (
    <MainLayout
      title="Relatórios de Substituições"
      subtitle="Histórico completo de trocas de equipamentos"
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ArrowRightLeft className="text-blue-600" size={20} />
              <div>
                <p className="text-sm text-muted-foreground">Total Substituições</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="text-orange-600" size={20} />
              <div>
                <p className="text-sm text-muted-foreground">Com Transferência</p>
                <p className="text-2xl font-bold">{stats.withCosts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="text-green-600" size={20} />
              <div>
                <p className="text-sm text-muted-foreground">Custos Extras</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalCosts.toString())}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="text-purple-600" size={20} />
              <div>
                <p className="text-sm text-muted-foreground">Motivo Principal</p>
                <p className="text-lg font-bold">
                  {topReason ? getReasonLabel(topReason[0]).substring(0, 8) : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label>Fornecedor</Label>
              <Input
                placeholder="Buscar fornecedor..."
                value={filters.supplier}
                onChange={(e) => setFilters({ ...filters, supplier: e.target.value })}
              />
            </div>

            <div>
              <Label>Motivo</Label>
              <Select
                value={filters.reason}
                onValueChange={(value) => setFilters({ ...filters, reason: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os motivos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="defect">Defeito</SelectItem>
                  <SelectItem value="damage">Dano</SelectItem>
                  <SelectItem value="upgrade">Upgrade</SelectItem>
                  <SelectItem value="maintenance">Manutenção</SelectItem>
                  <SelectItem value="wear">Desgaste Normal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Data Início</Label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />
            </div>

            <div>
              <Label>Data Fim</Label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => setFilters({
                  supplier: "",
                  reason: "",
                  startDate: "",
                  endDate: "",
                  responsibilityShift: false,
                })}
              >
                <Filter className="mr-2" size={16} />
                Limpar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          {filteredSubstitutions?.length || 0} substituição(ões) encontrada(s)
        </h3>
        <Button onClick={exportToCSV} variant="outline">
          <Download className="mr-2" size={16} />
          Exportar CSV
        </Button>
      </div>

      {/* Substitutions Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Equipamento Original</TableHead>
                <TableHead>Novo Equipamento</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Custos</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    {[...Array(8)].map((_, j) => (
                      <TableCell key={j}><div className="h-4 bg-muted rounded animate-pulse" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filteredSubstitutions?.length ? (
                filteredSubstitutions.map((substitution) => (
                  <TableRow key={substitution.id}>
                    <TableCell>
                      {formatDateTime(substitution.substitutionDate)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{substitution.rental.supplier.name}</p>
                        <p className="text-sm text-muted-foreground">{substitution.rental.supplier.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-red-600 font-medium">
                      {substitution.oldEquipmentName}
                    </TableCell>
                    <TableCell className="text-green-600 font-medium">
                      {substitution.newEquipmentName}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getReasonIcon(substitution.substitutionReason)}
                        <span>{getReasonLabel(substitution.substitutionReason)}</span>
                      </div>
                    </TableCell>
                    <TableCell>{substitution.supplierResponsible}</TableCell>
                    <TableCell>
                      {substitution.responsibilityShift ? (
                        <div>
                          <Badge variant="destructive" className="mb-1">Transferido</Badge>
                          {substitution.additionalCosts && (
                            <p className="text-sm font-medium">
                              {formatCurrency(substitution.additionalCosts)}
                            </p>
                          )}
                        </div>
                      ) : (
                        <Badge variant="secondary">Locadora</Badge>
                      )}
                    </TableCell>
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    <ArrowRightLeft size={48} className="mx-auto mb-2 opacity-20" />
                    <p>Nenhuma substituição encontrada</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Histórico de Substituições */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Substituições</CardTitle>
        </CardHeader>
        <CardContent>
          <SubstitutionHistory />
        </CardContent>
      </Card>
    </MainLayout>
  );
}