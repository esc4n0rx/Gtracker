"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { RetroButton } from "@/components/ui/retro-button"
import {
  Heart,
  Star,
  Gift,
  Crown,
  Zap,
  Shield,
  Download,
  Upload,
  MessageSquare,
  CheckCircle,
  CreditCard,
  Smartphone,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"

export default function DonatePage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const donationPlans = [
    {
      id: "supporter",
      name: "Supporter",
      price: "R$ 9,99",
      period: "/mês",
      color: "from-blue-500 to-blue-700",
      icon: Heart,
      popular: false,
      benefits: [
        "Acesso prioritário ao chat",
        "Badge especial no perfil",
        "Sem anúncios no fórum",
        "Download sem limite de velocidade",
        "Suporte prioritário",
      ],
    },
    {
      id: "vip",
      name: "VIP Member",
      price: "R$ 19,99",
      period: "/mês",
      color: "from-purple-500 to-purple-700",
      icon: Star,
      popular: true,
      benefits: [
        "Todos os benefícios Supporter",
        "Acesso a seção VIP exclusiva",
        "Upload com prioridade",
        "Histórico de downloads estendido",
        "Avatar personalizado",
        "Acesso antecipado a novos recursos",
      ],
    },
    {
      id: "premium",
      name: "Premium Elite",
      price: "R$ 39,99",
      period: "/mês",
      color: "from-yellow-500 to-yellow-700",
      icon: Crown,
      popular: false,
      benefits: [
        "Todos os benefícios VIP",
        "Acesso total a arquivos premium",
        "Upload ilimitado (até 10GB por arquivo)",
        "Moderação de conteúdo próprio",
        "Badge dourada exclusiva",
        "Participação em decisões da comunidade",
        "Suporte 24/7 dedicado",
      ],
    },
  ]

  const paymentMethods = [
    { name: "Cartão de Crédito", icon: CreditCard, available: true },
    { name: "PIX", icon: Smartphone, available: true },
    { name: "PayPal", icon: CreditCard, available: true },
    { name: "Boleto Bancário", icon: CreditCard, available: true },
  ]

  const supporters = [
    { name: "TechMaster", amount: "R$ 199,99", badge: "👑" },
    { name: "MovieLover", amount: "R$ 149,99", badge: "⭐" },
    { name: "GamePro", amount: "R$ 99,99", badge: "💎" },
    { name: "SeriesFan", amount: "R$ 79,99", badge: "🎭" },
    { name: "MusicAddict", amount: "R$ 59,99", badge: "🎵" },
  ]

  const handleDonate = (planId: string) => {
    setSelectedPlan(planId)
    // Simular processo de doação
    setTimeout(() => {
      alert(`Obrigado por escolher o plano ${planId}! Redirecionando para pagamento...`)
      setSelectedPlan(null)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-retro-dark via-retro-metal to-slate-900">
      <Header />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="retro-panel p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-retro-text mb-2 flex items-center gap-3">
                <Heart className="w-8 h-8 text-red-500" />
                Apoie o GTracker
              </h1>
              <p className="text-slate-400">Ajude a manter nossa comunidade ativa e nossos servidores funcionando</p>
            </div>
            <Link href="/dashboard">
              <RetroButton variant="secondary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </RetroButton>
            </Link>
          </div>
        </div>

        {/* Why Donate */}
        <div className="retro-panel p-6 border-l-4 border-retro-blue">
          <h2 className="text-xl font-bold text-retro-text mb-4">Por que doar?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <Shield className="w-8 h-8 text-retro-blue mx-auto mb-2" />
              <h3 className="font-bold text-retro-text mb-1">Servidores Seguros</h3>
              <p className="text-sm text-slate-400">Mantemos infraestrutura robusta e segura</p>
            </div>
            <div className="text-center">
              <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <h3 className="font-bold text-retro-text mb-1">Velocidade Máxima</h3>
              <p className="text-sm text-slate-400">Downloads e uploads em alta velocidade</p>
            </div>
            <div className="text-center">
              <Gift className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-bold text-retro-text mb-1">Conteúdo Exclusivo</h3>
              <p className="text-sm text-slate-400">Acesso a materiais premium e exclusivos</p>
            </div>
          </div>
        </div>

        {/* Donation Plans */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-retro-text text-center">Escolha seu Plano</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {donationPlans.map((plan) => (
              <div
                key={plan.id}
                className={`retro-panel p-6 relative ${
                  plan.popular ? "border-2 border-retro-neon shadow-lg shadow-retro-neon/20" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-retro-neon text-retro-dark px-3 py-1 rounded-full text-sm font-bold">
                      MAIS POPULAR
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-retro-text mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold text-retro-text">
                    {plan.price}
                    <span className="text-sm text-slate-400">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-300">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <RetroButton
                  className="w-full"
                  onClick={() => handleDonate(plan.id)}
                  disabled={selectedPlan === plan.id}
                >
                  {selectedPlan === plan.id ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Processando...
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4 mr-2" />
                      Escolher Plano
                    </>
                  )}
                </RetroButton>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <div className="retro-panel p-6">
              <h2 className="text-xl font-bold text-retro-text mb-4">Métodos de Pagamento</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {paymentMethods.map((method, index) => (
                  <div
                    key={index}
                    className={`p-4 border-2 rounded-lg text-center transition-all cursor-pointer ${
                      method.available
                        ? "border-slate-600 hover:border-retro-blue"
                        : "border-slate-700 opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <method.icon className="w-8 h-8 text-retro-blue mx-auto mb-2" />
                    <span className="text-sm text-retro-text">{method.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits Overview */}
            <div className="retro-panel p-6 mt-6">
              <h2 className="text-xl font-bold text-retro-text mb-4">Benefícios dos Apoiadores</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-retro-blue mb-3 flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Downloads
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li>• Velocidade máxima sem limitações</li>
                    <li>• Downloads simultâneos ilimitados</li>
                    <li>• Acesso a arquivos premium</li>
                    <li>• Histórico estendido de downloads</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-retro-blue mb-3 flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Uploads
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li>• Prioridade na fila de upload</li>
                    <li>• Limite de arquivo aumentado</li>
                    <li>• Moderação própria de conteúdo</li>
                    <li>• Estatísticas detalhadas</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-retro-blue mb-3 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Comunidade
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li>• Badge exclusiva no perfil</li>
                    <li>• Acesso a seções VIP</li>
                    <li>• Chat prioritário</li>
                    <li>• Suporte dedicado</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-retro-blue mb-3 flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Exclusivos
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li>• Acesso antecipado a recursos</li>
                    <li>• Participação em decisões</li>
                    <li>• Conteúdo exclusivo</li>
                    <li>• Eventos especiais</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Supporters */}
            <div className="retro-panel p-6">
              <h3 className="text-lg font-bold text-retro-text mb-4 flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                Top Apoiadores
              </h3>
              <div className="space-y-3">
                {supporters.map((supporter, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{supporter.badge}</span>
                      <span className="text-retro-text font-medium">{supporter.name}</span>
                    </div>
                    <span className="text-sm text-retro-blue">{supporter.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Goal */}
            <div className="retro-panel p-6">
              <h3 className="text-lg font-bold text-retro-text mb-4">Meta Mensal</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Arrecadado:</span>
                  <span className="text-green-400 font-bold">R$ 2.847</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Meta:</span>
                  <span className="text-retro-text">R$ 5.000</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-500 to-retro-blue h-3 rounded-full"
                    style={{ width: "57%" }}
                  ></div>
                </div>
                <div className="text-center text-sm text-slate-400">57% da meta atingida</div>
              </div>
            </div>

            {/* Server Costs */}
            <div className="retro-panel p-6">
              <h3 className="text-lg font-bold text-retro-text mb-4">Custos Mensais</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Servidores:</span>
                  <span className="text-retro-text">R$ 2.500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">CDN:</span>
                  <span className="text-retro-text">R$ 800</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Segurança:</span>
                  <span className="text-retro-text">R$ 400</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Manutenção:</span>
                  <span className="text-retro-text">R$ 300</span>
                </div>
                <hr className="border-slate-600" />
                <div className="flex justify-between font-bold">
                  <span className="text-retro-text">Total:</span>
                  <span className="text-retro-neon">R$ 4.000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
