import { Specification } from '../router/http-router';

export function generateUi(options: GenerateUiOptions): string {
  return `
  <!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <title>${ options.appName }@${ options.appVersion }</title>
    <base href="/">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  </head>
  <body>
  <div id="app">
    <div class="app-heading">
      ${ options.appName }@${ options.appVersion }
    </div>

    <div class="app-description">
      ${ options.appDescription }
    </div>

    <section class="route-list">
      <section class="route"
               :class="{
                  'route--DELETE': route.method === 'DELETE',
                  'route--GET': route.method === 'GET',
                  'route--HEAD': route.method === 'HEAD',
                  'route--OPTIONS': route.method === 'OPTIONS',
                  'route--PATCH': route.method === 'PATCH',
                  'route--POST': route.method === 'POST',
                  'route--PUT': route.method === 'PUT',
               }"
               v-for="route in routes">
        <div class="route__header" @click="route.open = !route.open">
          <div class="route__method"
               :class="{
                  'route__method--DELETE': route.method === 'DELETE',
                  'route__method--GET': route.method === 'GET',
                  'route__method--HEAD': route.method === 'HEAD',
                  'route__method--OPTIONS': route.method === 'OPTIONS',
                  'route__method--PATCH': route.method === 'PATCH',
                  'route__method--POST': route.method === 'POST',
                  'route__method--PUT': route.method === 'PUT',
               }">
            {{ route.method }}
          </div>

          <div class="route__path">
            {{ route.path }}
          </div>
        </div>

        <Transition name="fade" mode="out-in">
          <div class="route__metadata"
               v-if="route.open && route.metadata && route.metadata.contract && (route.metadata.contract.request || route.metadata.contract.responses)">
            <div v-if="route.metadata.contract.request">
              <div v-if="route.metadata.contract.request.body">
                <div v-for="(schema, mime) in route.metadata.contract.request.body">
                  <div class="route__metadata-heading">Request body ({{ mime }})</div>
                  <div class="route__metadata-content">
                    <pre>{{ stringify(schema) }}</pre>
                  </div>
                </div>
              </div>

              <div v-if="route.metadata.contract.request.headers">
                <div class="route__metadata-heading">Request headers</div>
                <div class="route__metadata-content">
                  <pre>{{ stringify(route.metadata.contract.request.headers) }}</pre>
                </div>
              </div>

              <div v-if="route.metadata.contract.request.params">
                <div class="route__metadata-heading">Request params</div>
                <div class="route__metadata-content">
                  <pre>{{ stringify(route.metadata.contract.request.params) }}</pre>
                </div>
              </div>

              <div v-if="route.metadata.contract.request.query">
                <div class="route__metadata-heading">Request query</div>
                <div class="route__metadata-content">
                  <pre>{{ stringify(route.metadata.contract.request.query) }}</pre>
                </div>
              </div>
            </div>

            <div v-if="route.metadata.contract.responses">
              <div v-for="(data, status) in route.metadata.contract.responses">
                <div v-if="data.body">
                  <div class="route__metadata-heading">Response body ({{ status }})</div>
                  <div class="route__metadata-content">
                    <pre>{{ stringify(data.body) }}</pre>
                  </div>
                </div>

                <div v-if="data.headers">
                  <div class="route__metadata-heading">Response headers ({{ status }})</div>
                  <div class="route__metadata-content">
                    <pre>{{ stringify(data.headers) }}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </section>
    </section>
  </div>

  <style>
    * {
      box-sizing: border-box;
      margin: 0;
    }

    body {
      padding: 64px;
    }

    .app-heading {
      display: block;
      font-family: monospace;
      font-size: 34px;
      font-weight: 700;
      line-height: normal;
      letter-spacing: 0;
      text-align: left;
      color: #3b4151;
    }

    .app-description {
      margin-top: 8px;
      display: block;
      font-family: monospace;
      font-size: 14px;
      font-weight: 600;
      line-height: normal;
      letter-spacing: 0;
      text-align: left;
      color: #3b4151;
    }

    .route-list {
      margin-top: 32px;
      display: grid;
      align-items: center;
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .route {
      width: 100%;
      padding: 16px;
      border: none;
      border-radius: 4px;
    }

    .route--DELETE {
      background: rgba(204, 51, 51, 0.1);
      border-color: rgba(204, 51, 51, 1);
    }

    .route--GET {
      background: rgba(47, 129, 50, 0.1);
      border-color: rgba(47, 129, 50, 1);
    }

    .route--HEAD {
      background: rgba(162, 61, 173, 0.1);
      border-color: rgba(162, 61, 173, 1);
    }

    .route--OPTIONS {
      background: rgba(148, 112, 20, 0.1);
      border-color: rgba(148, 112, 20, 1);
    }

    .route--PATCH {
      background: rgba(191, 88, 29, 0.1);
      border-color: rgba(191, 88, 29, 1);
    }

    .route--POST {
      background: rgba(24, 111, 175, 0.1);
      border-color: rgba(24, 111, 175, 1);
    }

    .route--PUT {
      background: rgba(149, 80, 124, 0.1);
      border-color: rgba(149, 80, 124, 1);
    }

    .route__header {
      display: grid;
      align-items: center;
      grid-template-columns: min-content 1fr;
      gap: 16px;
      cursor: pointer;
    }

    .route__method {
      background: #3b4151;
      border-radius: 3px;
      color: #FFF;
      width: 80px;
      padding: 6px 0;
      text-shadow: 0 1px 0 rgb(0 0 0 / 10%);

      font-family: monospace;
      font-size: 14px;
      font-weight: 700;
      line-height: normal;
      letter-spacing: 0;
      text-align: center;
    }

    .route__method--DELETE {
      background: #cc3333;
    }

    .route__method--GET {
      background: #2F8132;
    }

    .route__method--HEAD {
      background: #A23DAD;
    }

    .route__method--OPTIONS {
      background: #947014;
    }

    .route__method--PATCH {
      background: #bf581d;
    }

    .route__method--POST {
      background: #186FAF;
    }

    .route__method--PUT {
      background: #95507c;
    }

    .route__path {
      font-family: monospace;
      font-size: 16px;
      font-weight: 600;
      line-height: normal;
      letter-spacing: 0;
      text-align: left;
    }

    .route__metadata {
      margin-top: 8px;
      margin-left: 96px;
    }

    .route__metadata-heading {
      margin-top: 8px;
      display: block;
      font-family: monospace;
      font-size: 14px;
      font-weight: 700;
      line-height: normal;
      letter-spacing: 0;
      text-align: left;
      color: #888;
    }

    .route__metadata-content {
      margin-top: 8px;
      display: block;
      font-family: monospace;
      font-size: 14px;
      font-weight: 700;
      line-height: normal;
      letter-spacing: 0;
      text-align: left;
      color: #3b4151;
    }

    .fade-enter-active {
      transition: all 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
    }

    .fade-leave-active {
      transition: all 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
    }

    .fade-enter-from {
      opacity: 0;
    }

    .fade-leave-to {
      opacity: 0;
    }
  </style>

  <script>
    const { createApp } = Vue;

    createApp({
      data() {
        return {
          routes: ${ JSON.stringify(options.appSpecification.routes) },
        };
      },
      methods: {
        stringify(value) {
          return JSON.stringify(value, null, 2);
        },
      },
    }).mount('#app')
  </script>
  </body>
  </html>
  `;
}

export interface GenerateUiOptions {
  appDescription: string;
  appName: string;
  appSpecification: Specification;
  appVersion: string;
}
