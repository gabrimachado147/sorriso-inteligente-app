
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Database, 
  Table, 
  Search, 
  Plus, 
  RefreshCw,
  Download,
  Upload,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Settings,
  Shield
} from 'lucide-react';

export const DatabaseManager: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const tableStats = [
    { name: 'user_profiles', rows: 1247, size: '2.4 MB', lastModified: '2 horas' },
    { name: 'appointments', rows: 5632, size: '8.1 MB', lastModified: '15 min' },
    { name: 'clinics', rows: 89, size: '156 KB', lastModified: '1 dia' },
    { name: 'reviews', rows: 892, size: '1.2 MB', lastModified: '3 horas' },
    { name: 'reminders', rows: 2341, size: '567 KB', lastModified: '30 min' },
    { name: 'analytics_events', rows: 15678, size: '12.3 MB', lastModified: '5 min' }
  ];

  const recentQueries = [
    {
      query: 'SELECT COUNT(*) FROM appointments WHERE date >= CURRENT_DATE',
      execution_time: '45ms',
      result: '234 rows',
      status: 'success'
    },
    {
      query: 'UPDATE user_profiles SET last_login = NOW() WHERE id = $1',
      execution_time: '12ms',
      result: '1 row updated',
      status: 'success'
    },
    {
      query: 'SELECT * FROM clinics WHERE city = \'São Paulo\' AND is_active = true',
      execution_time: '23ms',
      result: '45 rows',
      status: 'success'
    }
  ];

  const performanceMetrics = {
    activeConnections: 12,
    maxConnections: 100,
    avgQueryTime: '28ms',
    slowQueries: 3,
    cacheHitRatio: '94.2%',
    diskUsage: '67%'
  };

  const backupData = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Database className="h-6 w-6 text-green-600" />
          Gerenciador de Banco de Dados
        </h2>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Conectado
          </Badge>
          <Button
            onClick={backupData}
            disabled={loading}
            size="sm"
            variant="outline"
          >
            {loading ? (
              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
            ) : (
              <Download className="h-3 w-3 mr-1" />
            )}
            Backup
          </Button>
        </div>
      </div>

      <Tabs defaultValue="tables" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="tables">Tabelas</TabsTrigger>
          <TabsTrigger value="queries">Queries</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="tables" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tableStats.map((table, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Table className="h-4 w-4 text-blue-600" />
                    {table.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Registros:</span>
                    <span className="font-mono">{table.rows.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Tamanho:</span>
                    <span className="font-mono">{table.size}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Modificado:</span>
                    <span className="text-muted-foreground">{table.lastModified}</span>
                  </div>
                  <div className="flex gap-1 pt-2">
                    <Button size="sm" variant="outline" className="flex-1 text-xs">
                      <Search className="h-3 w-3 mr-1" />
                      Ver
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 text-xs">
                      <Settings className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Ações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button variant="outline" size="sm">
                  <Plus className="h-3 w-3 mr-1" />
                  Nova Tabela
                </Button>
                <Button variant="outline" size="sm">
                  <Upload className="h-3 w-3 mr-1" />
                  Importar CSV
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-3 w-3 mr-1" />
                  Exportar
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Atualizar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="queries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Queries Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentQueries.map((query, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <code className="text-xs bg-gray-100 p-2 rounded flex-1 mr-2">
                        {query.query}
                      </code>
                      <Badge 
                        variant="secondary" 
                        className="bg-green-100 text-green-700"
                      >
                        {query.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Tempo: {query.execution_time}</span>
                      <span>{query.result}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Editor de Query</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea 
                className="w-full h-32 p-3 border rounded-md font-mono text-sm"
                placeholder="SELECT * FROM appointments WHERE..."
              />
              <div className="flex gap-2 mt-3">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Executar Query
                </Button>
                <Button size="sm" variant="outline">
                  Explicar Query
                </Button>
                <Button size="sm" variant="outline">
                  Formatar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Conexões Ativas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {performanceMetrics.activeConnections}
                </div>
                <div className="text-xs text-muted-foreground">
                  de {performanceMetrics.maxConnections} máximo
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Tempo Médio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {performanceMetrics.avgQueryTime}
                </div>
                <div className="text-xs text-muted-foreground">
                  por query
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Cache Hit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {performanceMetrics.cacheHitRatio}
                </div>
                <div className="text-xs text-muted-foreground">
                  taxa de acerto
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Queries Lentas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { query: 'SELECT * FROM analytics_events WHERE...', time: '1.2s' },
                  { query: 'UPDATE appointments SET status = ...', time: '845ms' },
                  { query: 'SELECT COUNT(*) FROM user_profiles...', time: '723ms' }
                ].map((slow, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                    <code className="text-xs flex-1">{slow.query}</code>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                      {slow.time}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Backup Automático</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status:</span>
                  <Badge className="bg-green-100 text-green-700">Ativo</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Frequência:</span>
                  <span className="text-sm">Diário às 03:00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Último backup:</span>
                  <span className="text-sm">Hoje, 03:00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Retenção:</span>
                  <span className="text-sm">30 dias</span>
                </div>
                <Button className="w-full">
                  Configurar Backup
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Backups Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { date: 'Hoje, 03:00', size: '45.2 MB', status: 'success' },
                    { date: 'Ontem, 03:00', size: '44.8 MB', status: 'success' },
                    { date: '2 dias atrás', size: '44.1 MB', status: 'success' },
                    { date: '3 dias atrás', size: '43.9 MB', status: 'success' }
                  ].map((backup, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="text-sm font-medium">{backup.date}</div>
                        <div className="text-xs text-muted-foreground">{backup.size}</div>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3" />
                        </Button>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Configurações de Segurança
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { setting: 'SSL/TLS Encryption', status: true },
                  { setting: 'Row Level Security', status: true },
                  { setting: 'Connection Pooling', status: true },
                  { setting: 'Query Logging', status: true },
                  { setting: 'Failed Login Monitoring', status: false },
                  { setting: 'IP Whitelist', status: false }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{item.setting}</span>
                    {item.status ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Logs de Acesso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { user: 'admin@senhorsorrriso.com', action: 'SELECT', time: '2 min' },
                    { user: 'api@senhorsorrriso.com', action: 'INSERT', time: '5 min' },
                    { user: 'backup@senhorsorrriso.com', action: 'BACKUP', time: '1 hora' }
                  ].map((log, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                      <span>{log.user}</span>
                      <span>{log.action}</span>
                      <span className="text-muted-foreground">{log.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
