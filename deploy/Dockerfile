FROM mcr.microsoft.com/azure-cli:cbl-mariner2.0

COPY ./dist ./dist

COPY .env .env

COPY entrypoint.sh entrypoint.sh

CMD ["/bin/sh", "entrypoint.sh"]
