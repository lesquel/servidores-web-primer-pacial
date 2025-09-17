src/
 ├── app/
 │    ├── features/
 │    │    ├── restaurant/
 │    │    │    ├── domain/            # Entidades y repositorios (interfaces)
 │    │    │    │    ├── restaurant.ts
 │    │    │    │    └── restaurant.repository.ts
 │    │    │    ├── application/       # Casos de uso (lógica de negocio de la feature)
 │    │    │    │    └── get-restaurants.use-case.ts
 │    │    │    ├── infrastructure/    # Implementaciones técnicas (HTTP, mappers, storage)
 │    │    │    │    └── restaurant-http.repository.ts
 │    │    │    └── presentation/      # Componentes y páginas Angular
 │    │    │         ├── pages/
 │    │    │         │    └── restaurant-list/
 │    │    │         │         ├── restaurant-list.component.ts
 │    │    │         │         └── restaurant-list.module.ts
 │    │    │         └── components/
 │    │    │              └── restaurant-card.component.ts
 │    │    │
 │    │    ├── reservation/
 │    │    │    ├── domain/
 │    │    │    ├── application/
 │    │    │    ├── infrastructure/
 │    │    │    └── presentation/
 │    │    │
 │    │    └── user/ ...
 │    │
 │    ├── shared/     # Cosas comunes a varias features (utils, layouts, ui components, pipes)
 │    └── app.module.ts
