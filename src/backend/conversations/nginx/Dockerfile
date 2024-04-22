# Production stage
FROM nginx:stable-alpine

# Copy the nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]