# 🎨 Neverafy Design System

Sistema de componentes UI reutilizables para mantener consistencia visual y UX en toda la aplicación.

## 📦 Componentes Disponibles

### **Buttons**
```tsx
import { Button } from '@/shared/components/ui';

// Variantes
<Button variant="primary">Primario</Button>
<Button variant="secondary">Secundario</Button>
<Button variant="danger">Peligro</Button>
<Button variant="premium">Premium</Button>

// Tamaños
<Button size="sm">Pequeño</Button>
<Button size="md">Mediano</Button>
<Button size="lg">Grande</Button>

// Con iconos
<Button icon={Plus} iconPosition="left">Añadir</Button>
<Button isLoading>Cargando...</Button>
```

### **Inputs & Forms**
```tsx
import { Input, Select } from '@/shared/components/ui';

<Input 
  label="Email" 
  type="email" 
  required 
  icon={Mail}
  helperText="Introduce tu email"
/>

<Select 
  label="Categoría"
  options={[
    { value: 'frutas', label: 'Frutas' },
    { value: 'verduras', label: 'Verduras' }
  ]}
  placeholder="Selecciona categoría"
/>
```

### **Cards & Layout**
```tsx
import { Card, CardHeader, CardBody, CardFooter } from '@/shared/components/ui';

<Card variant="elevated" hover>
  <CardHeader>
    <h3>Título de la Card</h3>
  </CardHeader>
  <CardBody>
    Contenido de la card
  </CardBody>
  <CardFooter>
    <Button>Acción</Button>
  </CardFooter>
</Card>
```

### **Feedback & Status**
```tsx
import { Alert, Badge, ProgressBar, Tooltip } from '@/shared/components/ui';

<Alert variant="success" title="¡Éxito!" dismissible>
  Producto añadido correctamente
</Alert>

<Badge variant="premium" icon={Crown}>Premium</Badge>

<ProgressBar value={75} max={100} variant="success" showLabel />

<Tooltip content="Información adicional">
  <Button>Hover me</Button>
</Tooltip>
```

### **Modals & Overlays**
```tsx
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/shared/components/ui';

<Modal isOpen={isOpen} onClose={onClose} title="Título" size="lg">
  <ModalBody>
    Contenido del modal
  </ModalBody>
  <ModalFooter>
    <Button variant="outline" onClick={onClose}>Cancelar</Button>
    <Button onClick={onSave}>Guardar</Button>
  </ModalFooter>
</Modal>
```

### **Loading States**
```tsx
import { LoadingScreen, Skeleton, SkeletonCard } from '@/shared/components/ui';

// Pantalla completa
<LoadingScreen />

// Esqueletos
<Skeleton width={200} height={20} />
<SkeletonCard />
```

## 🎨 Design Tokens

### **Colores**
- **Primary**: Green-600 (#059669)
- **Secondary**: Gray-600 (#4B5563)
- **Success**: Emerald-600 (#059669)
- **Warning**: Yellow-500 (#EAB308)
- **Danger**: Red-600 (#DC2626)
- **Premium**: Purple-600 to Blue-600 gradient

### **Tamaños**
- **sm**: text-sm, padding reducido
- **md**: text-sm, padding estándar
- **lg**: text-base, padding amplio
- **xl**: text-lg, padding extra amplio

### **Espaciado**
- Consistente con Tailwind spacing scale
- Múltiplos de 4px (1, 2, 3, 4, 6, 8...)

## 🚀 Mejores Prácticas

1. **Usa siempre los componentes del design system** antes de crear nuevos
2. **Mantén las variantes consistentes** - usa las props definidas
3. **Compón componentes complejos** usando los básicos como building blocks
4. **TypeScript strict** - todas las props están tipadas
5. **Accesibilidad incluida** - focus states, ARIA labels, keyboard navigation

## 📱 Responsive Design

Todos los componentes son **mobile-first** y responsive por defecto:
- Breakpoints consistentes con Tailwind
- Tamaños adaptativos en móviles
- Touch-friendly interfaces

## ⚡ Performance

- **Componentes ligeros** sin dependencias pesadas
- **Tree-shaking friendly** - importa solo lo que uses
- **Lazy loading** para componentes complejos
- **Memoización** en componentes que lo necesitan