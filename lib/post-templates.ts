
export interface PostTemplate {
  tipo: string
  categorias_aplicaveis: string[]
  campos: string[]
  campos_api?: string[]
}

export interface TemplateField {
  name: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'number' | 'url' | 'file'
  required: boolean
  placeholder?: string
  options?: { value: string; label: string }[]
  validation?: {
    min?: number
    max?: number
    pattern?: string
  }
}

export const POST_TEMPLATES: PostTemplate[] = [
  {
    tipo: "filme",
    categorias_aplicaveis: ["Gtracker - HTTP", "Gtracker - Torrents"],
    campos: [
      "tmdb_id",
      "titulo_personalizado",
      "qualidade",
      "formato",
      "idioma",
      "legenda",
      "duração",
      "tamanho",
      "links_download",
      "informações_extra"
    ],
    campos_api: ["poster", "sinopse", "elenco", "diretor", "generos", "ano_lancamento"]
  },
  {
    tipo: "série",
    categorias_aplicaveis: ["Gtracker - HTTP", "Gtracker - Torrents"],
    campos: [
      "tmdb_id",
      "temporada",
      "episodios",
      "qualidade",
      "formato",
      "idioma",
      "legenda",
      "tamanho",
      "links_download",
      "informações_extra"
    ],
    campos_api: ["poster", "sinopse", "elenco", "criadores", "generos", "ano_lancamento"]
  },
  {
    tipo: "jogo",
    categorias_aplicaveis: ["Gtracker - HTTP"],
    campos: [
      "titulo",
      "poster",
      "estilo",
      "desenvolvedora",
      "ano_lancamento",
      "plataforma",
      "sistema_operacional",
      "config_minima",
      "config_recomendada",
      "idioma",
      "formato",
      "tamanho",
      "links_download",
      "informações_extra"
    ]
  },
  {
    tipo: "software",
    categorias_aplicaveis: ["Gtracker - HTTP"],
    campos: [
      "titulo",
      "poster",
      "versao",
      "sistema_operacional",
      "idioma",
      "licenca",
      "formato",
      "tamanho",
      "links_download",
      "informações_extra"
    ]
  },
  {
    tipo: "curso",
    categorias_aplicaveis: ["Gtracker - HTTP"],
    campos: [
      "titulo",
      "poster",
      "plataforma_origem",
      "instrutor",
      "idioma",
      "carga_horaria",
      "categoria",
      "formato",
      "links_download",
      "informações_extra"
    ]
  },
  {
    tipo: "ebook",
    categorias_aplicaveis: ["Gtracker - HTTP", "Gtracker - Torrents"],
    campos: [
      "titulo",
      "autor",
      "idioma",
      "formato",
      "ano_publicacao",
      "categoria",
      "tamanho",
      "links_download",
      "informações_extra"
    ]
  },
  {
    tipo: "pedido_arquivo",
    categorias_aplicaveis: ["Gtracker - Social"],
    campos: [
      "tipo_conteudo",
      "titulo_desejado",
      "informacoes_complementares",
      "link_referencia",
      "urgencia"
    ]
  },
  {
    tipo: "candidatura",
    categorias_aplicaveis: ["Gtracker - Social"],
    campos: [
      "cargo_desejado",
      "experiencia_em_foruns",
      "conhecimentos_tecnicos",
      "tempo_disponivel",
      "motivo_interesse"
    ]
  },
  {
    tipo: "regras",
    categorias_aplicaveis: ["Gtracker - Social"],
    campos: [
      "titulo",
      "descricao_detalhada",
      "ultima_atualizacao"
    ]
  },
  {
    tipo: "anuncio_oficial",
    categorias_aplicaveis: ["Gtracker - Social"],
    campos: [
      "titulo",
      "mensagem",
      "link_referencia",
      "importancia"
    ]
  },
  {
    tipo: "sugestao",
    categorias_aplicaveis: ["Gtracker - Social"],
    campos: [
      "titulo",
      "descricao",
      "beneficios_para_o_forum",
      "implementacao_sugerida"
    ]
  },
  {
    tipo: "fale_conosco",
    categorias_aplicaveis: ["Gtracker - Social"],
    campos: [
      "assunto",
      "mensagem",
      "link_referencia_opcional"
    ]
  },
  {
    tipo: "apresentacao",
    categorias_aplicaveis: ["Gtracker - Social", "Gtracker - Comunidade"],
    campos: [
      "nome_ou_apelido",
      "como_conheceu_o_forum",
      "interesses",
      "categoria_favorita"
    ]
  },
  {
    tipo: "duvida_suporte",
    categorias_aplicaveis: ["Gtracker - Comunidade"],
    campos: [
      "titulo_problema",
      "descricao_detalhada",
      "categoria_relacionada",
      "link_erro_ou_imagem"
    ]
  }
]

// Mapeamento dos campos para labels e configurações
export const TEMPLATE_FIELD_CONFIG: Record<string, TemplateField> = {
  // Campos comuns
  titulo: {
    name: 'titulo',
    label: 'Título',
    type: 'text',
    required: true,
    placeholder: 'Digite o título do conteúdo'
  },
  titulo_personalizado: {
    name: 'titulo_personalizado',
    label: 'Título Personalizado',
    type: 'text',
    required: false,
    placeholder: 'Título personalizado (opcional)'
  },
  descricao: {
    name: 'descricao',
    label: 'Descrição',
    type: 'textarea',
    required: true,
    placeholder: 'Descreva o conteúdo detalhadamente'
  },
  
  // Campos específicos para filmes/séries
  tmdb_id: {
    name: 'tmdb_id',
    label: 'ID do TMDB',
    type: 'text',
    required: true,
    placeholder: 'Digite o ID do filme/série no TMDB'
  },
  temporada: {
    name: 'temporada',
    label: 'Temporada',
    type: 'number',
    required: false,
    placeholder: 'Número da temporada'
  },
  episodios: {
    name: 'episodios',
    label: 'Episódios',
    type: 'text',
    required: false,
    placeholder: 'Ex: 1-10, Completa'
  },
  
  // Campos técnicos
  qualidade: {
    name: 'qualidade',
    label: 'Qualidade',
    type: 'select',
    required: true,
    options: [
      { value: '4K', label: '4K (2160p)' },
      { value: '1080p', label: 'Full HD (1080p)' },
      { value: '720p', label: 'HD (720p)' },
      { value: '480p', label: 'SD (480p)' },
      { value: 'CAM', label: 'CAM' },
      { value: 'TS', label: 'TS' },
      { value: 'WEB-DL', label: 'WEB-DL' },
      { value: 'BluRay', label: 'BluRay' }
    ]
  },
  formato: {
    name: 'formato',
    label: 'Formato',
    type: 'select',
    required: true,
    options: [
      { value: 'MP4', label: 'MP4' },
      { value: 'MKV', label: 'MKV' },
      { value: 'AVI', label: 'AVI' },
      { value: 'WMV', label: 'WMV' },
      { value: 'MOV', label: 'MOV' }
    ]
  },
  idioma: {
    name: 'idioma',
    label: 'Idioma',
    type: 'select',
    required: true,
    options: [
      { value: 'português', label: 'Português' },
      { value: 'inglês', label: 'Inglês' },
      { value: 'espanhol', label: 'Espanhol' },
      { value: 'multi-idioma', label: 'Multi-idioma' }
    ]
  },
  legenda: {
    name: 'legenda',
    label: 'Legenda',
    type: 'select',
    required: false,
    options: [
      { value: 'português', label: 'Português' },
      { value: 'inglês', label: 'Inglês' },
      { value: 'sem-legenda', label: 'Sem legenda' },
      { value: 'multi-legenda', label: 'Multi-legenda' }
    ]
  },
  duração: {
    name: 'duração',
    label: 'Duração',
    type: 'text',
    required: false,
    placeholder: 'Ex: 120 min'
  },
  tamanho: {
    name: 'tamanho',
    label: 'Tamanho do Arquivo',
    type: 'text',
    required: true,
    placeholder: 'Ex: 2.5 GB'
  },
  links_download: {
    name: 'links_download',
    label: 'Links de Download',
    type: 'textarea',
    required: true,
    placeholder: 'Cole os links de download (um por linha)'
  },
  informações_extra: {
    name: 'informações_extra',
    label: 'Informações Extras',
    type: 'textarea',
    required: false,
    placeholder: 'Informações adicionais sobre o conteúdo'
  },

  // Campos para jogos
  estilo: {
    name: 'estilo',
    label: 'Gênero/Estilo',
    type: 'text',
    required: false,
    placeholder: 'Ex: Ação, RPG, Estratégia'
  },
  desenvolvedora: {
    name: 'desenvolvedora',
    label: 'Desenvolvedora',
    type: 'text',
    required: false,
    placeholder: 'Nome da desenvolvedora'
  },
  ano_lancamento: {
    name: 'ano_lancamento',
    label: 'Ano de Lançamento',
    type: 'number',
    required: false,
    placeholder: '2024'
  },
  plataforma: {
    name: 'plataforma',
    label: 'Plataforma',
    type: 'select',
    required: false,
    options: [
      { value: 'PC', label: 'PC' },
      { value: 'PlayStation', label: 'PlayStation' },
      { value: 'Xbox', label: 'Xbox' },
      { value: 'Nintendo', label: 'Nintendo' },
      { value: 'Mobile', label: 'Mobile' }
    ]
  },
  sistema_operacional: {
    name: 'sistema_operacional',
    label: 'Sistema Operacional',
    type: 'select',
    required: false,
    options: [
      { value: 'Windows', label: 'Windows' },
      { value: 'Mac', label: 'Mac' },
      { value: 'Linux', label: 'Linux' },
      { value: 'Android', label: 'Android' },
      { value: 'iOS', label: 'iOS' }
    ]
  },
  config_minima: {
    name: 'config_minima',
    label: 'Configuração Mínima',
    type: 'textarea',
    required: false,
    placeholder: 'Requisitos mínimos do sistema'
  },
  config_recomendada: {
    name: 'config_recomendada',
    label: 'Configuração Recomendada',
    type: 'textarea',
    required: false,
    placeholder: 'Requisitos recomendados do sistema'
  },

  // Campos para software
  versao: {
    name: 'versao',
    label: 'Versão',
    type: 'text',
    required: false,
    placeholder: 'Ex: v2.5.1'
  },
  licenca: {
    name: 'licenca',
    label: 'Licença',
    type: 'select',
    required: false,
    options: [
      { value: 'gratuito', label: 'Gratuito' },
      { value: 'pago', label: 'Pago' },
      { value: 'trial', label: 'Trial' },
      { value: 'crack', label: 'Crack' }
    ]
  },

  // Outros campos específicos
  poster: {
    name: 'poster',
    label: 'Poster/Imagem',
    type: 'url',
    required: false,
    placeholder: 'URL da imagem'
  },
  autor: {
    name: 'autor',
    label: 'Autor',
    type: 'text',
    required: false,
    placeholder: 'Nome do autor'
  }
}

export function getTemplateByType(tipo: string): PostTemplate | undefined {
  return POST_TEMPLATES.find(template => template.tipo === tipo)
}

export function getFieldConfig(fieldName: string): TemplateField {
  return TEMPLATE_FIELD_CONFIG[fieldName] || {
    name: fieldName,
    label: fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    type: 'text',
    required: false
  }
}

export function validateTemplate(tipo: string, categoria: string): boolean {
  const template = getTemplateByType(tipo)
  return template ? template.categorias_aplicaveis.includes(categoria) : false
}