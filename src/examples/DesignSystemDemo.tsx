import React, { useState } from 'react';
import {
  Button,
  Input,
  Select,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Badge,
  Alert,
  Modal,
  ProgressBar,
  Tooltip,
  Skeleton
} from '@/shared/components/ui';
import { Plus, Star, Crown } from 'lucide-react';

/**
 * Ejemplo completo de uso del Design System de Neverafy
 * Este componente demuestra todos los componentes UI disponibles
 */
const DesignSystemDemo: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

  const categoryOptions = [
    { value: 'frutas', label: 'Frutas' },
    { value: 'verduras', label: 'Verduras' },
    { value: 'lacteos', label: 'Lácteos' },
    { value: 'carnes', label: 'Carnes' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        🎨 Neverafy Design System Demo
      </h1>

      {/* Alerts */}
      {showAlert && (
        <Alert
          variant="success"
          title="¡Design System Cargado!"
          description="Todos los componentes están funcionando correctamente."
          dismissible
          onDismiss={() => setShowAlert(false)}
        />
      )}

      {/* Buttons Section */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Buttons</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Primario</Button>
              <Button variant="secondary">Secundario</Button>
              <Button variant="danger">Peligro</Button>
              <Button variant="success">Éxito</Button>
              <Button variant="premium" icon={Crown}>Premium</Button>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button size="sm">Pequeño</Button>
              <Button size="md">Mediano</Button>
              <Button size="lg">Grande</Button>
              <Button size="xl">Extra Grande</Button>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button icon={Plus} iconPosition="left">Con Icono</Button>
              <Button isLoading>Cargando...</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Demo Modal"
        size="lg"
      >
        <div className="space-y-4">
          <p>Este es un ejemplo de modal usando el design system.</p>
          
          <Alert variant="info" title="Información">
            Los modales se pueden usar para confirmaciones, formularios o contenido detallado.
          </Alert>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>
              Confirmar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DesignSystemDemo;