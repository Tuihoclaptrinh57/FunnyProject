# ADR-001: Keep Maven, adopt proposal's hexagonal + event bus + feature-first frontend

Date: 2026-09-01

## Context
Proposal suggested Gradle multi-module `platform/` with `shared-kernel` and `module-*`. Team asked to keep Maven.

## Decision
- Keep `backend/pom.xml` single-module Maven with `smart.tobi.*` packages as module boundaries (already hexagonal: `domain` pure, `application/port/in/out`, `adapter-in-*`, `adapter-out-*`)
- Implement `shared-kernel` as packages `smart.tobi.shared.domain` (UserId, Money, DomainEvent), `smart.tobi.shared.eventbus` (EventPublisherPort), `smart.tobi.shared.web` (ApiResponse) - no business logic
- Implement `EventPublisherPort` with `InMemoryEventPublisher` (Spring ApplicationEvent) now, `KafkaEventPublisher` later - domain only depends on `DomainEvent` + `EventPublisherPort`
- Frontend adopts `features/*` + `shared/ws-client` mirroring backend modules, `app/` routes remain `(feed)`, `(live)`, `(flashsale)`, etc.

## Consequences
- No Gradle migration, keeps CI (`mvn` in `ci.yml`) working
- Module boundaries still clear for interview: "Bounded Context from code structure"
- Migration to microservices only changes `adapter` layer (InMemory -> Kafka, in-process -> Feign), domain unchanged
