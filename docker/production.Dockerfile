# Production Dockerfile for Petals for Her (Caddy deploy)
# No vendor/cache required; runs Puma on PORT 3000 behind Caddy.
FROM ruby:3.3.4-slim-bookworm AS base

ENV RAILS_ENV=production
ENV LANG=C.UTF-8 LC_ALL=C.UTF-8
ENV APP_WORKDIR /rails

RUN set -eux; \
  apt-get update -qq; \
  apt-get install -y --no-install-recommends --fix-missing \
    ca-certificates curl libpq5 postgresql-client && \
  rm -rf /var/lib/apt/lists/*

WORKDIR $APP_WORKDIR

FROM base AS build

RUN set -eux; \
  apt-get update -qq; \
  apt-get install -y --no-install-recommends build-essential git libpq-dev libyaml-dev pkg-config; \
  rm -rf /var/lib/apt/lists/*

COPY Gemfile Gemfile.lock ./
RUN bundle config set --local deployment true && \
    bundle config set --local without "development test" && \
    bundle install --jobs 4 --retry 5 && \
    rm -rf "$GEM_HOME/cache"

COPY . .
RUN bundle exec bootsnap precompile -j 1 --gemfile 2>/dev/null || true
RUN bundle exec bootsnap precompile -j 1 app/ lib/ 2>/dev/null || true

FROM base

RUN groupadd --system --gid 1000 rails && \
    useradd rails --uid 1000 --gid 1000 --create-home --shell /bin/bash
USER 1000:1000

COPY --chown=rails:rails --from=build $APP_WORKDIR $APP_WORKDIR
COPY --chown=rails:rails docker/docker-entrypoint-prod.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
EXPOSE 3000
CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]
