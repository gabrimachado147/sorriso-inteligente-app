#!/usr/bin/env node
/**
 * Codacy MCP Server - Model Context Protocol Server
 * Integração do Codacy como servidor MCP para análise de qualidade de código
 * 
 * @version 1.0.0
 * @author Gabriel Machado
 * @project Sorriso Inteligente PWA
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

// Configuração do servidor MCP
class CodacyMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'codacy-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Configuração da Codacy API
    this.codacyConfig = {
      apiToken: process.env.CODACY_API_TOKEN || 'eJzda2H97ZUpnBA47FNt',
      organizationProvider: process.env.CODACY_ORGANIZATION_PROVIDER || 'gh',
      username: process.env.CODACY_USERNAME || 'gabrimachado147',
      projectName: process.env.CODACY_PROJECT_NAME || 'sorriso-inteligente-app',
      baseUrl: 'https://app.codacy.com/api/v3'
    };

    this.setupHandlers();
  }

  setupHandlers() {
    // Handler para listar ferramentas disponíveis
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'analyze_code_quality',
            description: 'Analisa a qualidade do código usando a API da Codacy',
            inputSchema: {
              type: 'object',
              properties: {
                filePath: {
                  type: 'string',
                  description: 'Caminho do arquivo para análise',
                },
                commitSha: {
                  type: 'string',
                  description: 'SHA do commit (opcional)',
                },
              },
              required: ['filePath'],
            },
          },
          {
            name: 'upload_coverage',
            description: 'Envia relatório de cobertura de testes para a Codacy',
            inputSchema: {
              type: 'object',
              properties: {
                coverageFile: {
                  type: 'string',
                  description: 'Caminho para o arquivo de cobertura (lcov.info)',
                },
                commitSha: {
                  type: 'string',
                  description: 'SHA do commit',
                },
              },
              required: ['coverageFile'],
            },
          },
          {
            name: 'get_project_metrics',
            description: 'Obtém métricas do projeto da Codacy',
            inputSchema: {
              type: 'object',
              properties: {
                metric: {
                  type: 'string',
                  enum: ['quality', 'coverage', 'duplication', 'complexity'],
                  description: 'Tipo de métrica a obter',
                },
              },
            },
          },
          {
            name: 'get_pull_request_analysis',
            description: 'Analisa pull request com a Codacy',
            inputSchema: {
              type: 'object',
              properties: {
                pullRequestNumber: {
                  type: 'number',
                  description: 'Número do pull request',
                },
              },
              required: ['pullRequestNumber'],
            },
          },
          {
            name: 'configure_quality_gates',
            description: 'Configura quality gates do projeto',
            inputSchema: {
              type: 'object',
              properties: {
                coverageThreshold: {
                  type: 'number',
                  description: 'Threshold mínimo de cobertura (%)',
                },
                qualityGrade: {
                  type: 'string',
                  enum: ['A', 'B', 'C', 'D'],
                  description: 'Nota mínima de qualidade',
                },
              },
            },
          },
        ],
      };
    });

    // Handler para executar ferramentas
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        switch (request.params.name) {
          case 'analyze_code_quality':
            return await this.analyzeCodeQuality(request.params.arguments);
          
          case 'upload_coverage':
            return await this.uploadCoverage(request.params.arguments);
          
          case 'get_project_metrics':
            return await this.getProjectMetrics(request.params.arguments);
          
          case 'get_pull_request_analysis':
            return await this.getPullRequestAnalysis(request.params.arguments);
          
          case 'configure_quality_gates':
            return await this.configureQualityGates(request.params.arguments);
          
          default:
            throw new Error(`Ferramenta desconhecida: ${request.params.name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Erro: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  // Método para analisar qualidade do código
  async analyzeCodeQuality({ filePath, commitSha }) {
    try {
      const url = `${this.codacyConfig.baseUrl}/projects/${this.codacyConfig.organizationProvider}/${this.codacyConfig.username}/${this.codacyConfig.projectName}/issues`;
      
      const params = {
        filename: filePath,
        ...(commitSha && { commit: commitSha }),
      };

      const response = await axios.get(url, {
        headers: {
          'api-token': this.codacyConfig.apiToken,
        },
        params,
      });

      const issues = response.data.data || [];
      
      const analysis = {
        file: filePath,
        totalIssues: issues.length,
        severityBreakdown: this.groupBySeverity(issues),
        categoryBreakdown: this.groupByCategory(issues),
        issues: issues.slice(0, 10), // Primeiros 10 issues
        recommendations: this.generateRecommendations(issues),
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(analysis, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Falha na análise de qualidade: ${error.message}`);
    }
  }

  // Método para upload de cobertura
  async uploadCoverage({ coverageFile, commitSha }) {
    try {
      // Lê o arquivo de cobertura
      const coverageData = await fs.readFile(coverageFile, 'utf8');
      
      // Upload via Codacy Coverage Reporter
      const { exec } = require('child_process');
      const util = require('util');
      const execPromise = util.promisify(exec);

      const uploadCommand = `bash <(curl -Ls https://coverage.codacy.com/get.sh) report -r "${coverageFile}"${commitSha ? ` -t ${commitSha}` : ''}`;
      
      const { stdout, stderr } = await execPromise(uploadCommand, {
        env: {
          ...process.env,
          CODACY_API_TOKEN: this.codacyConfig.apiToken,
          CODACY_ORGANIZATION_PROVIDER: this.codacyConfig.organizationProvider,
          CODACY_USERNAME: this.codacyConfig.username,
          CODACY_PROJECT_NAME: this.codacyConfig.projectName,
        },
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              status: 'success',
              message: 'Cobertura enviada com sucesso',
              output: stdout,
              file: coverageFile,
              commit: commitSha,
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Falha no upload de cobertura: ${error.message}`);
    }
  }

  // Método para obter métricas do projeto
  async getProjectMetrics({ metric }) {
    try {
      const baseUrl = `${this.codacyConfig.baseUrl}/projects/${this.codacyConfig.organizationProvider}/${this.codacyConfig.username}/${this.codacyConfig.projectName}`;
      
      let endpoint;
      switch (metric) {
        case 'quality':
          endpoint = `${baseUrl}/quality`;
          break;
        case 'coverage':
          endpoint = `${baseUrl}/coverage`;
          break;
        case 'duplication':
          endpoint = `${baseUrl}/duplication`;
          break;
        case 'complexity':
          endpoint = `${baseUrl}/complexity`;
          break;
        default:
          endpoint = baseUrl;
      }

      const response = await axios.get(endpoint, {
        headers: {
          'api-token': this.codacyConfig.apiToken,
        },
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              metric,
              data: response.data,
              timestamp: new Date().toISOString(),
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Falha ao obter métricas: ${error.message}`);
    }
  }

  // Método para analisar pull request
  async getPullRequestAnalysis({ pullRequestNumber }) {
    try {
      const url = `${this.codacyConfig.baseUrl}/projects/${this.codacyConfig.organizationProvider}/${this.codacyConfig.username}/${this.codacyConfig.projectName}/pulls/${pullRequestNumber}`;
      
      const response = await axios.get(url, {
        headers: {
          'api-token': this.codacyConfig.apiToken,
        },
      });

      const analysis = {
        pullRequest: pullRequestNumber,
        status: response.data.status,
        quality: response.data.quality,
        coverage: response.data.coverage,
        newIssues: response.data.newIssues || [],
        summary: {
          issuesAdded: response.data.newIssues?.length || 0,
          coverageChange: response.data.coverageChange || 0,
          qualityChange: response.data.qualityChange || 0,
        },
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(analysis, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Falha na análise do PR: ${error.message}`);
    }
  }

  // Método para configurar quality gates
  async configureQualityGates({ coverageThreshold, qualityGrade }) {
    try {
      const url = `${this.codacyConfig.baseUrl}/projects/${this.codacyConfig.organizationProvider}/${this.codacyConfig.username}/${this.codacyConfig.projectName}/settings/quality-gates`;
      
      const config = {
        ...(coverageThreshold && { coverageThreshold }),
        ...(qualityGrade && { qualityGrade }),
      };

      const response = await axios.put(url, config, {
        headers: {
          'api-token': this.codacyConfig.apiToken,
          'Content-Type': 'application/json',
        },
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              status: 'configured',
              config,
              response: response.data,
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Falha na configuração de quality gates: ${error.message}`);
    }
  }

  // Métodos auxiliares
  groupBySeverity(issues) {
    return issues.reduce((acc, issue) => {
      const severity = issue.severity || 'unknown';
      acc[severity] = (acc[severity] || 0) + 1;
      return acc;
    }, {});
  }

  groupByCategory(issues) {
    return issues.reduce((acc, issue) => {
      const category = issue.category || 'unknown';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
  }

  generateRecommendations(issues) {
    const recommendations = [];
    
    if (issues.length > 10) {
      recommendations.push('Alto número de issues detectados. Considere refatoração.');
    }
    
    const criticalIssues = issues.filter(i => i.severity === 'Error');
    if (criticalIssues.length > 0) {
      recommendations.push(`${criticalIssues.length} issues críticos encontrados. Priorize a correção.`);
    }
    
    return recommendations;
  }

  // Método para iniciar o servidor
  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Codacy MCP Server iniciado');
  }
}

// Execução do servidor
if (require.main === module) {
  const server = new CodacyMCPServer();
  server.run().catch(console.error);
}

module.exports = CodacyMCPServer;
