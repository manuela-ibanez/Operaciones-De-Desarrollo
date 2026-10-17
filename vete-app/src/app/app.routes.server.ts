import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Los listados cargan datos desde el navegador al abrir la pantalla.
  // Asi el build no necesita conectarse al backend de Render.
  {
    path: 'mascotas',
    renderMode: RenderMode.Client,
  },
  {
    path: 'usuarios',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
