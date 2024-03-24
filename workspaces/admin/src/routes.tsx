import { lazy } from 'react';
import { createRootRoute, createRoute, createRouter, redirect } from '@tanstack/react-router';

import { authApiClient } from './features/auth/apiClient/authApiClient';
import { CommonLayout } from './foundation/layouts/CommonLayout';
import { queryClient } from './lib/api/queryClient';

const AuthPage = lazy(() => import('./pages/AuthPage'));
const AuthorListPage = lazy(() => import('./pages/AuthorListPage'));
const BookListPage = lazy(() => import('./pages/BookListPage'));
const EpisodeCreatePage = lazy(() => import('./pages/EpisodeCreatePage'));
const EpisodeDetailPage = lazy(() => import('./pages/EpisodeDetailPage'));

async function authGuard(): Promise<void> {
  const user = await queryClient.fetchQuery({
    queryFn: async () => {
      try {
        const user = await authApiClient.fetchAuthUser();
        return user;
      } catch (_err) {
        return null;
      }
    },
    queryKey: authApiClient.fetchAuthUser$$key(),
  });

  if (user == null) {
    throw redirect({
      to: `/admin`,
    });
  }
}

const rootRoute = createRootRoute({
  component: CommonLayout,
});

const authRoute = createRoute({
  component: AuthPage,
  getParentRoute: () => rootRoute,
  path: `/admin`,
});

const authorListRoute = createRoute({
  beforeLoad: authGuard,
  component: AuthorListPage,
  getParentRoute: () => rootRoute,
  path: `/admin/authors`,
});

const bookListRoute = createRoute({
  beforeLoad: authGuard,
  component: BookListPage,
  getParentRoute: () => rootRoute,
  path: `/admin/books`,
});

export const episodeDetailRoute = createRoute({
  beforeLoad: authGuard,
  component: EpisodeDetailPage,
  getParentRoute: () => rootRoute,
  path: `/admin/books/$bookId/episodes/$episodeId`,
});

export const episodeCreateRoute = createRoute({
  beforeLoad: authGuard,
  component: EpisodeCreatePage,
  getParentRoute: () => rootRoute,
  path: `/admin/books/$bookId/episodes/new`,
});

const routeTree = rootRoute.addChildren([
  authRoute,
  authorListRoute,
  bookListRoute,
  episodeDetailRoute,
  episodeCreateRoute,
]);

export const router = () => {
  return createRouter({ routeTree });
};
