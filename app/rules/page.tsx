"use client"

import { Header } from "@/components/layout/header"
import { RetroButton } from "@/components/ui/retro-button"
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  ArrowLeft,
  Scale,
  Users,
  Upload,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"

export default function RulesPage() {
  const rules = [
    {
      id: 1,
      category: "Regras Gerais",
      icon: Shield,
      color: "text-blue-400",
      items: [
        "Respeite todos os membros da comunidade",
        "Não use linguagem ofensiva, discriminatória ou inadequada",
        "Proibido spam, flood ou mensagens repetitivas",
        "Não compartilhe informações pessoais de outros usuários",
        "Siga as instruções dos moderadores e administradores",
      ],
    },
    {
      id: 2,
      category: "Uploads e Downloads",
      icon: Upload,
      color: "text-green-400",
      items: [
        "Não faça upload de conteúdo protegido por direitos autorais",
        "Verifique se o arquivo está livre de vírus antes do upload",
        "Use títulos descritivos e categorias corretas",
        "Não faça upload de conteúdo duplicado",
        "Máximo de 5GB por arquivo",
        "Proibido conteúdo adulto ou inadequado",
      ],
    },
    {
      id: 3,
      category: "Fórum e Discussões",
      icon: MessageSquare,
      color: "text-purple-400",
      items: [
        "Mantenha os tópicos organizados nas categorias corretas",
        "Use a função de busca antes de criar novos tópicos",
        "Não faça necropost em tópicos antigos sem necessidade",
        "Contribua de forma construtiva nas discussões",
        "Não desvie o assunto principal do tópico",
      ],
    },
    {
      id: 4,
      category: "Conta e Segurança",
      icon: Users,
      color: "text-yellow-400",
      items: [
        "Não compartilhe sua senha com terceiros",
        "Use senhas seguras e únicas",
        "Não crie múltiplas contas",
        "Reporte atividades suspeitas aos moderadores",
        "Mantenha suas informações de contato atualizadas",
      ],
    },
  ]

  const penalties = [
    {
      level: "Advertência",
      description: "Primeira violação leve das regras",
      action: "Aviso formal registrado no perfil",
      color: "text-yellow-400",
      icon: AlertTriangle,
    },
    {
      level: "Suspensão Temporária",
      description: "Violações repetidas ou moderadas",
      action: "Bloqueio de 1 a 30 dias",
      color: "text-orange-400",
      icon: XCircle,
    },
    {
      level: "Banimento Permanente",
      description: "Violações graves ou repetidas",
      action: "Exclusão definitiva da conta",
      color: "text-red-400",
      icon: XCircle,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-retro-dark via-retro-metal to-slate-900">
      <Header />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="retro-panel p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-retro-text mb-2 flex items-center gap-3">
                <Scale className="w-8 h-8 text-retro-blue" />
                Regras e Diretrizes
              </h1>
              <p className="text-slate-400">
                Leia atentamente as regras para manter nossa comunidade saudável e organizada
              </p>
            </div>
            <Link href="/dashboard">
              <RetroButton variant="secondary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </RetroButton>
            </Link>
          </div>
        </div>

        {/* Important Notice */}
        <div className="retro-panel p-6 border-l-4 border-red-500">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-500 mt-1" />
            <div>
              <h3 className="font-bold text-retro-text mb-2">⚠️ IMPORTANTE</h3>
              <p className="text-slate-300 mb-3">
                O descumprimento das regras pode resultar em advertências, suspensões ou banimento permanente. Todos os
                usuários são responsáveis por conhecer e seguir estas diretrizes.
              </p>
              <p className="text-sm text-slate-400">Última atualização: 15 de Janeiro de 2024</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Rules Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Rules Sections */}
            {rules.map((section) => (
              <div key={section.id} className="retro-panel p-6">
                <div className="flex items-center gap-3 mb-4">
                  <section.icon className={`w-6 h-6 ${section.color}`} />
                  <h2 className="text-xl font-bold text-retro-text">{section.category}</h2>
                </div>
                <ul className="space-y-3">
                  {section.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Penalties Section */}
            <div className="retro-panel p-6">
              <h2 className="text-xl font-bold text-retro-text mb-6 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                Sistema de Penalidades
              </h2>
              <div className="space-y-4">
                {penalties.map((penalty, index) => (
                  <div key={index} className="border border-slate-600 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <penalty.icon className={`w-5 h-5 ${penalty.color} mt-1`} />
                      <div className="flex-1">
                        <h3 className={`font-bold ${penalty.color} mb-1`}>{penalty.level}</h3>
                        <p className="text-slate-300 mb-2">{penalty.description}</p>
                        <p className="text-sm text-slate-400">{penalty.action}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Section */}
            <div className="retro-panel p-6">
              <h2 className="text-xl font-bold text-retro-text mb-4 flex items-center gap-3">
                <Info className="w-6 h-6 text-retro-blue" />
                Dúvidas ou Problemas?
              </h2>
              <div className="space-y-3 text-slate-300">
                <p>Se você tiver dúvidas sobre as regras ou precisar reportar uma violação:</p>
                <ul className="space-y-2 ml-4">
                  <li>• Entre em contato com um moderador no chat</li>
                  <li>• Envie uma mensagem privada para a administração</li>
                  <li>• Use o sistema de denúncias do fórum</li>
                  <li>• Acesse nossa central de ajuda</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Links */}
            <div className="retro-panel p-6">
              <h3 className="text-lg font-bold text-retro-text mb-4">Links Úteis</h3>
              <div className="space-y-3">
                <Link href="/forum" className="block text-retro-blue hover:text-retro-neon transition-colors">
                  📋 Ir para o Fórum
                </Link>
                <Link href="/upload" className="block text-retro-blue hover:text-retro-neon transition-colors">
                  📤 Central de Upload
                </Link>
                <Link href="/chat" className="block text-retro-blue hover:text-retro-neon transition-colors">
                  💬 Chat da Comunidade
                </Link>
                <Link href="/help" className="block text-retro-blue hover:text-retro-neon transition-colors">
                  ❓ Central de Ajuda
                </Link>
              </div>
            </div>

            {/* Staff Team */}
            <div className="retro-panel p-6">
              <h3 className="text-lg font-bold text-retro-text mb-4">Equipe de Moderação</h3>
              <div className="space-y-3">
                {[
                  { name: "AdminMaster", role: "Administrador", status: "online" },
                  { name: "ModeratorPro", role: "Moderador", status: "online" },
                  { name: "HelperBot", role: "Assistente", status: "away" },
                ].map((staff, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-8 h-8 bg-gradient-to-br from-retro-blue to-retro-purple rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {staff.name.charAt(0)}
                      </div>
                      <div
                        className={`absolute -bottom-1 -right-1 w-3 h-3 ${staff.status === "online" ? "bg-green-500" : "bg-yellow-500"} rounded-full border-2 border-slate-800`}
                      ></div>
                    </div>
                    <div>
                      <div className="text-retro-text font-medium">{staff.name}</div>
                      <div className="text-xs text-slate-400">{staff.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistics */}
            <div className="retro-panel p-6">
              <h3 className="text-lg font-bold text-retro-text mb-4">Estatísticas</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Usuários Ativos:</span>
                  <span className="text-green-400 font-bold">1,234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Advertências (mês):</span>
                  <span className="text-yellow-400 font-bold">23</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Banimentos (mês):</span>
                  <span className="text-red-400 font-bold">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Taxa de Conformidade:</span>
                  <span className="text-retro-neon font-bold">98.7%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
