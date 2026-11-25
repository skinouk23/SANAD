FROM nginx:alpine

# Generic dist path — override at build time for any framework:
#   Vite / CRA default:   dist/          (this default)
#   NX Angular:           dist/apps/<app-name>/browser/
#   Create React App:     build/
ARG DIST_PATH=dist

COPY nginx.conf /etc/nginx/nginx.conf
COPY ${DIST_PATH} /usr/share/nginx/html

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]