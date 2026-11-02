import { BASE_URL } from '@/utils/helpers';
import YAML from 'yaml';

export async function GET({ }) {
  const siteId =
    import.meta.env.PUBLIC_DECAPBRIDGE_ID ||
    '947a0ea6-f1cd-480f-9552-1ff2b7bdc7e3';
  const repo = import.meta.env.PUBLIC_REPO || 'joanmat117/wa-catalog';
  const branch = import.meta.env.PUBLIC_REPO_BRANCH || 'main';
  const site = import.meta.env.SITE;

  const config = {
    media_folder: '/public/images',
    public_folder: '/images',

    backend: {
      name: 'git-gateway',
      repo,
      branch,
      auth_type: 'pkce',
      base_url: 'https://auth.decapbridge.com',
      auth_endpoint: `/sites/${siteId}/pkce`,
      auth_token_endpoint: `/sites/${siteId}/token`,
      gateway_url: 'https://gateway.decapbridge.com',

      commit_messages: {
        create: 'Create {{collection}} "{{slug}}" - {{author-name}} <{{author-login}}> via DecapBridge',
        update: 'Update {{collection}} "{{slug}}" - {{author-name}} <{{author-login}}> via DecapBridge',
        delete: 'Delete {{collection}} "{{slug}}" - {{author-name}} <{{author-login}}> via DecapBridge',
        uploadMedia:
          'Upload "{{path}}" - {{author-name}} <{{author-login}}> via DecapBridge',
        deleteMedia:
          'Delete "{{path}}" - {{author-name}} <{{author-login}}> via DecapBridge',
        openAuthoring:
          'Message {{message}} - {{author-name}} <{{author-login}}> via DecapBridge',
      },
    },

    // Enable PKCE fields (optional, recommended)
    auth: {
      email_claim: 'email',
      first_name_claim: 'first_name',
      last_name_claim: 'last_name',
      avatar_url_claim: 'avatar_url',
    },

    // Better Decap + Bridge logo (optional)
    logo_url:
      import.meta.env.PUBLIC_DECAP_CMS_LOGO_URL ||
      'https://decapbridge.com/decapcms-with-bridge.svg',

    // Add site links in Decap CMS (optional)
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
            label: 'Es un producto destacado?',
            name: 'featured',
            widget: 'boolean',
            default: false,
          },
          // {
          //   label: 'Es VIP?',
          //   name: 'vip',
          //   widget: 'boolean',
          //   default: false,
          // },
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
            label: 'Categoría del producto',
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
