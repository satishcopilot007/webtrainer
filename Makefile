.PHONY: dev build prod seed migrate test clean

# Development
dev:
	docker-compose up --build

dev-d:
	docker-compose up --build -d

stop:
	docker-compose down

logs:
	docker-compose logs -f

# Backend
migrate:
	docker-compose exec backend python manage.py migrate

makemigrations:
	docker-compose exec backend python manage.py makemigrations

seed:
	docker-compose exec backend python manage.py seed_courses

createsuperuser:
	docker-compose exec backend python manage.py createsuperuser

shell:
	docker-compose exec backend python manage.py shell

collectstatic:
	docker-compose exec backend python manage.py collectstatic --noinput

# Frontend
frontend-shell:
	docker-compose exec frontend sh

# Production
prod:
	docker-compose -f docker-compose.prod.yml up --build -d

prod-down:
	docker-compose -f docker-compose.prod.yml down

prod-logs:
	docker-compose -f docker-compose.prod.yml logs -f

# Testing
test-backend:
	docker-compose exec backend python manage.py test

# Clean
clean:
	docker-compose down -v --remove-orphans
	docker system prune -f
