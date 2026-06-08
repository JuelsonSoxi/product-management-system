import { useState } from 'react';
import apiClient from '../../api/client';
import Navbar from '../../components/Navbar';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function AdminReports() {
  const [reportType, setReportType] = useState('general');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  const handleGenerateReport = async () => {
    setLoading(true);
    setReportData(null);

    try {
      const params = {
        type: reportType,
        format: 'json',
        ...(startDate && { start_date: startDate }),
        ...(endDate && { end_date: endDate }),
      };

      const response = await apiClient.get('/v1/admin/reports/generate', { params });
      setReportData(response.data.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao gerar relatório');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!reportData) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Título
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(reportData.title, pageWidth / 2, 20, { align: 'center' });
    
    // Período
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const periodText = `Período: ${new Date(reportData.period.start).toLocaleDateString('pt-PT')} até ${new Date(reportData.period.end).toLocaleDateString('pt-PT')}`;
    doc.text(periodText, pageWidth / 2, 30, { align: 'center' });
    
    let yPos = 45;

    // Dados do relatório baseado no tipo
    if (reportType === 'general') {
      const data = [
        ['Novos Utilizadores', reportData.users.toString()],
        ['Consultas', reportData.appointments.toString()],
        ['Registos Clínicos', reportData.medical_records.toString()],
      ];
      
      autoTable(doc, {
        startY: yPos,
        head: [['Métrica', 'Valor']],
        body: data,
        theme: 'grid',
        headStyles: { fillColor: [147, 51, 234] },
      });
      
      yPos = doc.lastAutoTable.finalY + 15;
      
      // Top 5 Especialidades
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Top 5 Especialidades', 14, yPos);
      yPos += 10;
      
      const specialtiesData = Object.entries(reportData.top_specialties || {}).map(([name, count]) => [name, count.toString()]);
      
      autoTable(doc, {
        startY: yPos,
        head: [['Especialidade', 'Consultas']],
        body: specialtiesData,
        theme: 'striped',
        headStyles: { fillColor: [147, 51, 234] },
      });
    }

    if (reportType === 'users') {
      const summaryData = [
        ['Total de Utilizadores', reportData.total_users.toString()],
        ['Ativos', reportData.active_users.toString()],
        ['Inativos', reportData.inactive_users.toString()],
      ];
      
      autoTable(doc, {
        startY: yPos,
        head: [['Métrica', 'Valor']],
        body: summaryData,
        theme: 'grid',
        headStyles: { fillColor: [147, 51, 234] },
      });
      
      yPos = doc.lastAutoTable.finalY + 15;
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Utilizadores por Tipo', 14, yPos);
      yPos += 10;
      
      const rolesData = Object.entries(reportData.users_by_role || {}).map(([role, count]) => [role, count.toString()]);
      
      autoTable(doc, {
        startY: yPos,
        head: [['Tipo', 'Quantidade']],
        body: rolesData,
        theme: 'striped',
        headStyles: { fillColor: [147, 51, 234] },
      });
    }

    if (reportType === 'appointments') {
      const summaryData = [
        ['Total de Consultas', reportData.total.toString()],
      ];
      
      autoTable(doc, {
        startY: yPos,
        body: summaryData,
        theme: 'grid',
        headStyles: { fillColor: [147, 51, 234] },
      });
      
      yPos = doc.lastAutoTable.finalY + 15;
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Por Status', 14, yPos);
      yPos += 10;
      
      const statusData = Object.entries(reportData.by_status || {}).map(([status, count]) => [status, count.toString()]);
      
      autoTable(doc, {
        startY: yPos,
        head: [['Status', 'Quantidade']],
        body: statusData,
        theme: 'striped',
        headStyles: { fillColor: [147, 51, 234] },
      });
      
      yPos = doc.lastAutoTable.finalY + 15;
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Por Especialidade', 14, yPos);
      yPos += 10;
      
      const specialtyData = Object.entries(reportData.by_specialty || {}).map(([specialty, count]) => [specialty, count.toString()]);
      
      autoTable(doc, {
        startY: yPos,
        head: [['Especialidade', 'Consultas']],
        body: specialtyData,
        theme: 'striped',
        headStyles: { fillColor: [147, 51, 234] },
      });
    }

    if (reportType === 'doctors') {
      const summaryData = [
        ['Total de Médicos', reportData.total_doctors.toString()],
      ];
      
      autoTable(doc, {
        startY: yPos,
        body: summaryData,
        theme: 'grid',
        headStyles: { fillColor: [147, 51, 234] },
      });
      
      yPos = doc.lastAutoTable.finalY + 15;
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Consultas por Médico', 14, yPos);
      yPos += 10;
      
      const doctorsData = reportData.appointments_per_doctor.map(d => [d.name, d.appointments.toString()]);
      
      autoTable(doc, {
        startY: yPos,
        head: [['Médico', 'Consultas']],
        body: doctorsData,
        theme: 'striped',
        headStyles: { fillColor: [147, 51, 234] },
      });
    }

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Página ${i} de ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
      doc.text(
        `Gerado em: ${new Date().toLocaleDateString('pt-PT')} às ${new Date().toLocaleTimeString('pt-PT')}`,
        14,
        doc.internal.pageSize.getHeight() - 10
      );
    }

    // Download
    const fileName = `relatorio_${reportType}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  const renderReportData = () => {
    if (!reportData) return null;

    return (
      <div className="bg-white rounded-xl shadow-md p-6 mt-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{reportData.title}</h2>
          <button
            onClick={handleDownloadPDF}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition flex items-center gap-2"
          >
            <span>📥</span>
            Baixar PDF
          </button>
        </div>

        {/* Período */}
        <div className="bg-purple-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600">
            Período: <span className="font-semibold">
              {new Date(reportData.period.start).toLocaleDateString('pt-PT')} até {new Date(reportData.period.end).toLocaleDateString('pt-PT')}
            </span>
          </p>
        </div>

        {/* Dados do Relatório */}
        <div className="space-y-6">
          {reportType === 'users' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total de Utilizadores</p>
                  <p className="text-3xl font-bold text-blue-600">{reportData.total_users}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Ativos</p>
                  <p className="text-3xl font-bold text-green-600">{reportData.active_users}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Inativos</p>
                  <p className="text-3xl font-bold text-red-600">{reportData.inactive_users}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Por Tipo</h3>
                <div className="space-y-2">
                  {Object.entries(reportData.users_by_role).map(([role, count]) => (
                    <div key={role} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="capitalize">{role}</span>
                      <span className="font-bold">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {reportType === 'appointments' && (
            <>
              <div className="bg-purple-50 p-6 rounded-lg">
                <p className="text-sm text-gray-600">Total de Consultas</p>
                <p className="text-4xl font-bold text-purple-600">{reportData.total}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Por Status</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(reportData.by_status).map(([status, count]) => (
                    <div key={status} className="p-4 bg-gray-50 rounded-lg text-center">
                      <p className="text-sm text-gray-600 capitalize">{status}</p>
                      <p className="text-2xl font-bold text-gray-900">{count}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Por Especialidade</h3>
                <div className="space-y-2">
                  {Object.entries(reportData.by_specialty).map(([specialty, count]) => (
                    <div key={specialty} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>{specialty}</span>
                      <span className="font-bold">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {reportType === 'doctors' && (
            <>
              <div className="bg-green-50 p-6 rounded-lg">
                <p className="text-sm text-gray-600">Total de Médicos</p>
                <p className="text-4xl font-bold text-green-600">{reportData.total_doctors}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Por Especialidade</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(reportData.by_specialty).map(([specialty, count]) => (
                    <div key={specialty} className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">{specialty}</p>
                      <p className="text-2xl font-bold text-gray-900">{count} médico(s)</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Consultas por Médico</h3>
                <div className="space-y-2">
                  {reportData.appointments_per_doctor.map((doctor, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>{doctor.name}</span>
                      <span className="font-bold">{doctor.appointments} consultas</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {reportType === 'general' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Novos Utilizadores</p>
                  <p className="text-3xl font-bold text-blue-600">{reportData.users}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Consultas</p>
                  <p className="text-3xl font-bold text-purple-600">{reportData.appointments}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Registos Clínicos</p>
                  <p className="text-3xl font-bold text-green-600">{reportData.medical_records}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Top 5 Especialidades</h3>
                <div className="space-y-2">
                  {Object.entries(reportData.top_specialties).map(([specialty, count]) => (
                    <div key={specialty} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>{specialty}</span>
                      <span className="font-bold">{count} consultas</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Relatórios</h1>
          <p className="text-gray-600">Gere relatórios detalhados do sistema</p>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Relatório
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="general">Geral</option>
                <option value="users">Utilizadores</option>
                <option value="appointments">Consultas</option>
                <option value="doctors">Médicos</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Início
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Fim
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleGenerateReport}
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium transition disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    A gerar...
                  </span>
                ) : (
                  '📊 Gerar Relatório'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Dados do Relatório */}
        {renderReportData()}
      </div>
    </div>
  );
}
