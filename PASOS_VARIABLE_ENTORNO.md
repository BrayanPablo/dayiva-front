# 📝 PASOS PARA AGREGAR VARIABLE DE ENTORNO EN VERCEL

## 🎯 PASO A PASO

### 1. Haz clic en el proyecto `dayiva-front`
   - En la lista de proyectos, haz clic en la tarjeta que dice:
     ```
     dayiva-front
     dayiva-front.vercel.app
     ```

### 2. Ve a Settings
   - En el menú lateral izquierdo, busca y haz clic en **"Settings"**
   - (Está en la parte inferior del menú)

### 3. Abre Environment Variables
   - Dentro de Settings, busca la sección **"Environment Variables"**
   - Haz clic en ella

### 4. Agrega la variable
   - Haz clic en el botón **"Add New"** o **"Add"**
   - Completa los campos:
     - **Key:** `VITE_API_URL`
     - **Value:** `https://dayiva-back-production.up.railway.app`
     - **Environment:** Marca las 3 casillas:
       - ✅ Production
       - ✅ Preview  
       - ✅ Development
   - Haz clic en **"Save"**

### 5. Redesplega
   - Ve a la pestaña **"Deployments"** (en el menú superior)
   - Encuentra el último deployment
   - Haz clic en los **3 puntos (...)** al lado del deployment
   - Selecciona **"Redeploy"**
   - O simplemente haz clic en **"Redeploy"** si está visible

---

## 🔗 URL DIRECTA (MÁS RÁPIDO)

Puedes ir directamente a:
```
https://vercel.com/brayans-projects-101a6e1b/dayiva-front/settings/environment-variables
```

---

## ✅ VERIFICACIÓN

Después de redesplegar, verifica:

1. Abre tu aplicación: https://dayiva-front.vercel.app
2. Deberías ver la página de login
3. Intenta iniciar sesión
4. Si funciona, significa que la variable está configurada correctamente

---

## 🎯 RESUMEN

**Dónde está:**
- Proyecto → Settings → Environment Variables

**Qué agregar:**
- Key: `VITE_API_URL`
- Value: `https://dayiva-back-production.up.railway.app`

**Qué hacer después:**
- Redesplegar el proyecto

