// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/oceanicNext');
const darkCodeTheme = require('prism-react-renderer/themes/oceanicNext');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'utpp',
  tagline: 'Universal Text Pre-Processor',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://utpp.adriansoftware.de',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'adrianschubek', // Usually your GitHub org/user name.
  projectName: 'utpp', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mermaid: true,
  },

  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/adrianschubek/utpp/tree/main/docs/',

          sidebarCollapsible: false,

          lastVersion: 'current',
          versions: {
            current: {
              label: '0.5.x',
              path: '/',
            },
          },
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/utpp.png',
      algolia: {
        // The application ID provided by Algolia
        appId: '0VG12FAEM6',
  
        // Public API key: it is safe to commit it
        apiKey: 'a90b8ec6a4d93799cc3ea9c91c84af2b',
  
        indexName: 'utpp-adriansoftware',
  
        // Optional: see doc section below
        contextualSearch: true,
  
        // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
        // externalUrlRegex: 'external\\.com|domain\\.com',
  
        // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
        replaceSearchResultPathname: {
          from: '/docs/', // or as RegExp: /\/docs\//
          to: '/',
        },
  
        // Optional: Algolia search parameters
        searchParameters: {},
  
        // Optional: path for search page that enabled by default (`false` to disable it)
        searchPagePath: 'search',
  
        //... other Algolia params
      },
      navbar: {
        title: 'utpp',
        /* logo: {
          alt: 'My Site Logo',
          src: 'img/logo.svg',
        }, */
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Docs',
          },
          /*  
            { to: '/blog', label: 'Blog', position: 'left' }, */
          {
            type: 'docsVersionDropdown',
            position: 'right',
          },
          {
            href: 'https://github.com/adrianschubek/utpp',
            className: 'header-github-link',
            position: 'right',
          },
        ],
      },
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      footer: {
        style: 'dark',
        links: [
          /*  {
             title: 'Docs',
             items: [
               {
                 label: 'Tutorial',
                 to: '/docs/intro',
               },
             ],
           }, */
          /*  {
             title: 'Community',
             items: [
               {
                 label: 'Stack Overflow',
                 href: 'https://stackoverflow.com/questions/tagged/docusaurus',
               },
               {
                 label: 'Discord',
                 href: 'https://discordapp.com/invite/docusaurus',
               },
               {
                 label: 'Twitter',
                 href: 'https://twitter.com/docusaurus',
               },
             ],
           },
           {
             title: 'More',
             items: [
               {
                 label: 'Blog',
                 to: '/blog',
               },
               {
                 label: 'GitHub',
                 href: 'https://github.com/facebook/docusaurus',
               },
             ],
           }, */
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Adrian Schubek`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['php']
      },
    }),
};

module.exports = config;
