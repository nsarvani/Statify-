import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/layout";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Artists from "@/pages/artists";
import Songs from "@/pages/songs";
import Playlists from "@/pages/playlists";
import ForYou from "@/pages/for-you";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard">
        {() => (
          <Layout>
            <Dashboard />
          </Layout>
        )}
      </Route>
      <Route path="/artists">
        {() => (
          <Layout>
            <Artists />
          </Layout>
        )}
      </Route>
      <Route path="/songs">
        {() => (
          <Layout>
            <Songs />
          </Layout>
        )}
      </Route>
      <Route path="/recommendations">
        {() => (
          <Layout>
            <ForYou />
          </Layout>
        )}
      </Route>
      <Route path="/playlists">
        {() => (
          <Layout>
            <Playlists />
          </Layout>
        )}
      </Route>
      <Route>
        {() => (
          <Layout>
            <NotFound />
          </Layout>
        )}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;