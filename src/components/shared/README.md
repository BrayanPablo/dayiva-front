# Componentes Reutilizables

Esta carpeta contiene componentes reutilizables que siguen el principio DRY (Don't Repeat Yourself) y proporcionan una interfaz consistente en toda la aplicación.

## Componentes Disponibles

### Button
Componente de botón reutilizable con múltiples variantes y tamaños.

```jsx
import Button from '../shared/Button';

<Button 
  variant="primary"    // primary, secondary, danger, success
  size="large"         // small, medium, large
  loading={false}      // muestra spinner cuando está cargando
  disabled={false}     // deshabilita el botón
  onClick={handleClick}
>
  Texto del botón
</Button>
```

### Input
Componente de input reutilizable con validación y labels.

```jsx
import Input from '../shared/Input';

<Input
  label="Nombre"           // etiqueta del campo
  name="name"              // nombre del campo
  value={value}            // valor del campo
  onChange={handleChange}  // función de cambio
  type="text"              // tipo de input
  required={true}          // campo obligatorio
  error="Error message"    // mensaje de error
  placeholder="Placeholder"
/>
```

### Select
Componente select reutilizable con opciones.

```jsx
import Select from '../shared/Select';

<Select
  label="Género"
  name="gender"
  value={value}
  onChange={handleChange}
  options={[
    { value: "male", label: "Masculino" },
    { value: "female", label: "Femenino" }
  ]}
  placeholder="Seleccione una opción"
  required={true}
/>
```

### Textarea
Componente textarea reutilizable.

```jsx
import Textarea from '../shared/Textarea';

<Textarea
  label="Descripción"
  name="description"
  value={value}
  onChange={handleChange}
  rows={3}
  placeholder="Escriba aquí..."
  required={true}
/>
```

### DataTable
Componente de tabla de datos con búsqueda, ordenamiento y paginación.

```jsx
import DataTable from '../shared/DataTable';

<DataTable
  data={data}                    // array de datos
  columns={columns}              // configuración de columnas
  searchFields={['name', 'email']} // campos de búsqueda
  itemsPerPage={10}              // elementos por página
  onView={handleView}            // función para ver detalles
  onEdit={handleEdit}            // función para editar
  onDelete={handleDelete}        // función para eliminar
  loading={false}                // estado de carga
/>
```

## Hooks Personalizados

### useForm
Hook personalizado para manejo de formularios.

```jsx
import { useForm } from '../hooks/useForm';

const { formData, handleChange, reset } = useForm({
  name: '',
  email: ''
});
```

## Beneficios

- **Consistencia**: Todos los componentes tienen el mismo estilo y comportamiento
- **Mantenibilidad**: Cambios centralizados en un solo lugar
- **Reutilización**: Reduce código duplicado
- **Escalabilidad**: Fácil agregar nuevas funcionalidades
- **Testing**: Componentes probados y confiables

## Uso Recomendado

1. **Siempre usar** estos componentes en lugar de crear nuevos
2. **Mantener** la consistencia en props y estilos
3. **Documentar** cualquier nueva funcionalidad
4. **Testear** antes de usar en producción
