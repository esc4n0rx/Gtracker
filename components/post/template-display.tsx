"use client";

import { RetroButton } from '@/components/ui/retro-button';
import { Download, Info, Tag, Monitor, Volume2, FileText, Globe, LucideProps } from 'lucide-react';
import React, { ElementType } from 'react'; // Importando ElementType para tipar ícones dinâmicos

// Tipagem para os ícones do Lucide. Poderia ser mais específica se necessário.
type IconComponent = ElementType<LucideProps>;

interface TemplateDisplayProps {
  /** Tipo do post, pode ser usado pra lógicas futuras ou contextos diferentes. */
  postType: string;
  /** Objeto com os dados do template. É um Record genérico porque a estrutura pode variar bastante. */
  templateData: Record<string, any>;
}

/**
 * Componente `TemplateDisplay`
 * --------------------------
 *
 * Responsável por renderizar os detalhes de um template,
 * incluindo links de download, especificações (tags) e informações adicionais.
 * Ele se adapta com base nos dados fornecidos em `templateData`.
 *
 * @param {string} postType - O tipo do post (ex: 'game', 'software', 'movie'). Atualmente não altera a renderização, mas tá aí pra jogo.
 * @param {Record<string, any>} templateData - Os dados brutos do template. A gente espera chaves como `links_download`, `qualidade`, etc.
 */
export function TemplateDisplay({ postType, templateData }: TemplateDisplayProps) {

  /**
   * Renderiza a seção de links de download.
   * Cada link é um string separado por quebra de linha no `templateData.links_download`.
   */
  const renderDownloadLinks = (links: string) => {
    // Quebra a string de links em um array, tirando linhas vazias.
    const linkArray = links.split('\n').filter(link => link.trim());

    // Se não tiver link, nem esquenta.
    if (linkArray.length === 0) return null;

    return (
      <div className="space-y-3">
        <h4 className="text-lg font-bold text-retro-text flex items-center gap-2">
          <Download className="w-5 h-5 text-green-400" />
          Links de Download
        </h4>
        <div className="space-y-2">
          {linkArray.map((link, index) => (
            <div key={`download-${index}`} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                <Download className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0"> {/* min-w-0 é um truque pra truncagem funcionar em flex items */}
                <div className="text-sm text-slate-400">Link #{index + 1}</div>
                <div className="text-xs text-slate-500 truncate" title={link}>{link}</div>
              </div>
              {/* O <a> engloba o botão pra fazer o link funcionar direitinho */}
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0" // Impede que o botão encolha demais
              >
                <RetroButton size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </RetroButton>
              </a>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /**
   * Renderiza a seção de especificações (tags).
   * Filtra os campos relevantes de `templateData` e os exibe com ícones.
   */
  const renderTags = () => {
    // Campos que a gente considera como "tags" ou especificações.
    const tagFields: string[] = ['qualidade', 'formato', 'idioma', 'legenda', 'tamanho', 'sistema_operacional', 'plataforma'];

    const tags = tagFields
      .filter(field => templateData[field]) // Pega só os campos que existem no templateData
      .map(field => ({
        label: field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), // Deixa o label bonitinho: "sistema_operacional" -> "Sistema Operacional"
        value: templateData[field] as string, // A gente espera que o valor da tag seja uma string
        icon: getTagIcon(field) // Pega o ícone correspondente
      }));

    // Sem tags? Sem seção.
    if (tags.length === 0) return null;

    return (
      <div className="space-y-3">
        <h4 className="text-lg font-bold text-retro-text flex items-center gap-2">
          <Tag className="w-5 h-5 text-blue-400" />
          Especificações
        </h4>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <div
              key={`tag-${index}-${tag.label}`} // Chave um pouco mais robusta
              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-slate-700 to-slate-800 rounded-lg border border-slate-600"
            >
              <tag.icon className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="text-sm">
                <span className="text-slate-400">{tag.label}:</span>
                <span className="text-retro-text ml-1 font-medium">{tag.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /**
   * Renderiza a seção de informações adicionais.
   * Semelhante às tags, mas para campos de texto mais longos ou variados.
   */
  const renderAdditionalInfo = () => {
    // Lista de campos que consideramos como "informações adicionais".
    const infoFields: string[] = [
      'duração', 'informações_extra', 'versao', 'desenvolvedora',
      'config_minima', 'config_recomendada', 'licenca', 'autor',
      'carga_horaria', 'instrutor', 'categoria'
    ];

    const infoItems = infoFields
      .filter(field => templateData[field]) // Só os que têm valor
      .map(field => ({
        label: field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), // "informações_extra" -> "Informações Extra"
        value: templateData[field] as string, // Esperamos string aqui também
        // Se o texto for muito grande, a gente ativa um scrollzinho.
        isLong: typeof templateData[field] === 'string' && templateData[field].length > 100
      }));

    // Se não tiver nada pra mostrar, partiu.
    if (infoItems.length === 0) return null;

    return (
      <div className="space-y-3">
        <h4 className="text-lg font-bold text-retro-text flex items-center gap-2">
          <Info className="w-5 h-5 text-purple-400" />
          Informações Adicionais
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {infoItems.map((item, index) => (
            <div key={`info-${index}-${item.label}`} className="bg-slate-800/50 p-4 rounded-lg">
              <h5 className="text-sm font-medium text-retro-blue mb-2">{item.label}</h5>
              {/*
                Conteúdo da informação. Se for longo, adiciona uma classe pra scroll.
                `whitespace-pre-line` preserva as quebras de linha do texto original.
              */}
              <div className={`text-sm text-slate-300 ${item.isLong ? 'max-h-32 overflow-y-auto pretty-scrollbar' : ''}`}>
                {item.isLong ? (
                  <div className="whitespace-pre-line">{item.value}</div>
                ) : (
                  item.value
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Estrutura principal do componente.
  // Renderiza cada seção se houver dados pra ela.
  return (
    <div className="space-y-6 p-4 md:p-6 bg-slate-900 rounded-xl shadow-xl">
      {/* Seção de Tags/Especificações */}
      {renderTags()}

      {/* Seção de Links de Download - só aparece se tiver links_download no templateData */}
      {templateData.links_download && typeof templateData.links_download === 'string' && renderDownloadLinks(templateData.links_download)}

      {/* Seção de Informações Adicionais */}
      {renderAdditionalInfo()}
    </div>
  );
}

/**
 * `getTagIcon`
 * -------------
 *
 * Pequena função utilitária pra mapear um nome de campo (field)
 * para um componente de ícone específico do Lucide.
 * Se não achar um ícone pro campo, usa um genérico `Tag`.
 *
 * @param {string} field - O nome do campo (ex: 'qualidade', 'formato').
 * @returns {IconComponent} - O componente de ícone do Lucide.
 */
function getTagIcon(field: string): IconComponent {
  // Mapeamento de campos para seus respectivos ícones.
  // Adicione mais aqui conforme a necessidade!
  const iconMap: Record<string, IconComponent> = {
    'qualidade': Monitor,
    'formato': FileText,
    'idioma': Globe,
    'legenda': FileText, // Mesmo ícone de formato, pode ser? 🤔
    'tamanho': Info, // Ícone genérico de Info, talvez um 'HardDrive' fosse legal?
    'sistema_operacional': Monitor,
    'plataforma': Monitor, // Repetido, mas faz sentido.
    'audio': Volume2, // Adicionei um pra 'audio' como exemplo.
  };
  return iconMap[field] || Tag; // Fallback pra um ícone genérico de Tag.
}

// Poderia adicionar uma classe CSS global para 'pretty-scrollbar' se quisesse customizar
// a barra de rolagem nos textos longos. Algo como:
// .pretty-scrollbar::-webkit-scrollbar { width: 8px; }
// .pretty-scrollbar::-webkit-scrollbar-thumb { background-color: #4A5568; border-radius: 4px; }
// .pretty-scrollbar::-webkit-scrollbar-track { background-color: #2D3748; }