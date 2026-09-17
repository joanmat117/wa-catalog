import { BASE_URL } from '@/utils/helpers';
import YAML from 'yaml';

export async function GET({ }) {
  const siteId =
    import.meta.env.PUBLIC_DECAPBRIDGE_ID ||
    'b24d4304-f503-45ca-b408-da24db405ebb';
  const repo = import.meta.env.PUBLIC_REPO || 'joanmat117/wa-catalog';
  const branch = import.meta.env.PUBLIC_REPO_BRANCH || 'main';
  const site = import.meta.env.SITE;

  // Currency options for DecapCMS
  const CURRENCY_RAW = import.meta.env.PUBLIC_ALLOWED_CURRENCIES ?? '';
  const CURRENCIES = CURRENCY_RAW
    ? CURRENCY_RAW.split(',').map((c: string) => c.trim()).filter((c: string): boolean => c.length > 0)
    : ['CUP'];
  const CURRENCY_OPTIONS = CURRENCIES.map((cur: string) => ({
    label: cur,
    value: cur,
  }));

  const config = {
    media_folder: '/public/images',
    public_folder: '/images',

    backend: {
      name: 'git-gateway',
      repo,
      branch,
      identity_url: `https://auth.decapbridge.com/sites/${siteId}`,
      gateway_url: 'https://gateway.decapbridge.com',

      commit_messages: {
        create: 'data: create "{{slug}}" - {{author-name}} via DecapBridge',
        update: 'data: update "{{slug}}" - {{author-name}} via DecapBridge',
        delete: 'data: delete "{{slug}}" - {{author-name}} via DecapBridge',
        uploadMedia:
          'data: upload "{{path}}" - {{author-name}} via DecapBridge',
        deleteMedia:
          'data: delete "{{path}}" - {{author-name}} via DecapBridge',
        openAuthoring:
          'data: message {{message}} - {{author-name}} via DecapBridge',
      },
    },
    ...(import.meta.env.PUBLIC_DECAP_CMS_LOGO_URL
      ? { logo_url: import.meta.env.PUBLIC_DECAP_CMS_LOGO_URL }
      : {}),
    site_url: site.replace(/\/$/, '') + BASE_URL,

    collections: [
      {
        name: 'products',
        extension: 'json',
        label: 'Productos',
        folder: 'src/data/products',
        create: true,
        slug: '{{name}}',
        editor: {
          preview: false,
        },
        fields: [
          {
            label: 'Nombre del producto',
            name: 'name',
            widget: 'string',
          },
          {
            label: 'Precio',
            name: 'price',
            widget: 'number',
            default: 1000,
            value_type: 'int',
            min: 0,
            step: 200,
          },
          {
            label: 'Moneda',
            name: 'currency',
            widget: 'select',
            options: CURRENCY_OPTIONS,
            default: CURRENCIES[0],
          },
          {
            label: 'Es un producto destacado?',
            name: 'featured',
            widget: 'boolean',
            default: false,
          },
          {
            label: 'Es VIP?',
            name: 'vip',
            widget: 'boolean',
            default: false,
          },
          {
            label: 'Está disponible?',
            name: 'available',
            widget: 'boolean',
            default: true,
          },
          {
            label: 'Descripción o pequeño resumen',
            name: 'description',
            widget: 'string',
          },
          {
            label: 'Fotos del producto',
            name: 'images',
            widget: 'list',
            field: { label: 'Imagen', name: 'image', widget: 'image' },
          },
          {
            label: 'Categorías',
            name: 'categories',
            widget: 'relation',
            collection: 'config',
            file: 'categories',
            multiple: true,
            search_fields: ['categories.*.label'],
            display_fields: ['categories.*.label'],
            value_field: 'categories.*.key',
          },
        ],
      },
      {
        name: 'config',
        label: 'Configuración',
        files: [
          {
            name: 'categories',
            extension: 'json',
            editor: {
              preview: false,
            },
            label: 'Categorías',
            file: 'src/data/categories.json',
            fields: [
              {
                label: 'categories',
                name: 'categories',
                widget: 'list',
                fields: [
                  {
                    label: 'Nombre',
                    name: 'label',
                    widget: 'string',
                  },
                  {
                    label: 'Emoji',
                    name: 'emoji',
                    widget: 'string',
                    default: '🌿',
                  },
                  {
                    label: 'Clave/ID',
                    name: 'key',
                    widget: 'string',
                    default: 'key1234',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  return new Response(YAML.stringify(config), {
    headers: {
      'Content-Type': 'application/x-yaml',
    },
  });
}
