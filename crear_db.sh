#!/bin/bash

# --- CONFIGURACIÓN DE CONEXIÓN ---
# Puedes cambiar 'root' por tu usuario si usas otro.
# El script solicitará la contraseña de forma segura al ejecutarse.
DB_USER="root"
DB_HOST="localhost"

echo "========================================="
echo "  CREADOR AUTOMÁTICO DE BASES DE DATOS  "
echo "========================================="

# 1. Solicitar el nombre de la base de datos
read -p "Introduce el nombre de la DB que deseas crear: " DB_NAME

# Validar que no esté vacío
if [ -z "$DB_NAME" ]; then
    echo "❌ Error: El nombre de la base de datos no puede estar vacío."
    exit 1
fi

# 2. Solicitar la contraseña de MariaDB (no se mostrará en pantalla al escribir)
read -sp "Introduce la contraseña de MariaDB para el usuario '$DB_USER': " DB_PASS
echo ""

# 3. Comprobar si la base de datos ya existe
DB_EXISTS=$(mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" -e "SHOW DATABASES LIKE '$DB_NAME';" 2>/dev/null)

if [ ! -z "$DB_EXISTS" ]; then
    echo "⚠️  La base de datos '$DB_NAME' ya existe en el servidor."
    exit 0
fi

# 4. Crear la base de datos con codificación UTF-8 recomendada
echo "Creando la base de datos '$DB_NAME'..."

mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" -e "CREATE DATABASE \`$DB_NAME\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null

# 5. Verificar si se creó correctamente
if [ $? -eq 0 ]; then
    echo "✅ ¡Base de datos '$DB_NAME' creada con éxito con charset utf8mb4!"
else
    echo "❌ Error: No se pudo crear la base de datos. Verifica tu contraseña o permisos."
fi