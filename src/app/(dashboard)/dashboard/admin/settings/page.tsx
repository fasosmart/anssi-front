"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Settings,
  Shield,
  Clock,
  Bell,
  Users,
  FileText,
  Globe,
  Database,
  Mail,
  Phone,
  MapPin,
  Save,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Info
} from "lucide-react";

// Mock data - sera remplacé par l'API
const mockAccreditationTypes = [
  {
    slug: "apacs",
    name: "APACS - Accompagnement et Conseil en sécurité",
    description: "Prestataires d'accompagnement et de conseil en sécurité des systèmes d'information",
    duration: 12,
    status: "active",
    requirements: [
      "Licence en informatique ou télécommunications",
      "Certificat professionnel en cybersécurité",
      "3 ans d'expérience minimum",
      "Adresse physique en Guinée"
    ],
    fees: {
      processing: 500000,
      annual: 5372000
    }
  },
  {
    slug: "apassi",
    name: "APASSI - Audit de la Sécurité des Systèmes d'Information",
    description: "Prestataires d'audit de sécurité des systèmes d'information",
    duration: 12,
    status: "active",
    requirements: [
      "Master en cybersécurité ou équivalent",
      "Certification CISSP ou équivalente",
      "5 ans d'expérience en audit",
      "Outils validés par l'ANSSI"
    ],
    fees: {
      processing: 500000,
      annual: 10508300
    }
  },
  {
    slug: "apdis",
    name: "APDIS - Détection d'Incidents de Sécurité",
    description: "Prestataires de services de détection d'incidents de sécurité (SOC)",
    duration: 12,
    status: "active",
    requirements: [
      "Expertise en monitoring 24/7",
      "Certification en cybersécurité",
      "Infrastructure SOC certifiée",
      "Équipe d'experts qualifiés"
    ],
    fees: {
      processing: 500000,
      annual: 10508300
    }
  },
  {
    slug: "apris",
    name: "APRIS - Réponse aux Incidents de Sécurité",
    description: "Prestataires de services de réponse aux incidents (CERT)",
    duration: 12,
    status: "active",
    requirements: [
      "Certification en gestion d'incidents",
      "Équipe d'intervention 24/7",
      "Procédures d'urgence validées",
      "Partenariats avec les autorités"
    ],
    fees: {
      processing: 500000,
      annual: 10508300
    }
  },
  {
    slug: "apin",
    name: "APIN - Investigation Numérique",
    description: "Prestataires de services d'investigation numérique (Forensic)",
    duration: 12,
    status: "active",
    requirements: [
      "Formation en investigation numérique",
      "Outils forensiques certifiés",
      "Expérience en procédures judiciaires",
      "Laboratoire d'analyse agréé"
    ],
    fees: {
      processing: 500000,
      annual: 10508300
    }
  }
];

const mockSystemSettings = {
  general: {
    site_name: "ANSSI Guinée",
    site_description: "Agence Nationale de la Sécurité des Systèmes d'Information",
    contact_email: "contact@anssi.gov.gn",
    contact_phone: "+224 123 456 789",
    address: "Conakry, République de Guinée",
    timezone: "Africa/Conakry",
    language: "fr",
    maintenance_mode: false
  },
  notifications: {
    email_notifications: true,
    sms_notifications: false,
    push_notifications: true,
    new_accreditation: true,
    status_change: true,
    document_validation: true,
    system_alerts: true
  },
  workflow: {
    auto_approval: false,
    review_duration: 30,
    reminder_days: [7, 14, 21],
    escalation_enabled: true,
    escalation_days: 45
  },
  security: {
    password_min_length: 8,
    password_require_special: true,
    session_timeout: 480,
    two_factor_auth: true,
    ip_whitelist: false,
    audit_logs: true
  }
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(mockSystemSettings);
  const [accreditationTypes, setAccreditationTypes] = useState(mockAccreditationTypes);
  const [selectedType, setSelectedType] = useState<any>(null);

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    // Logique de sauvegarde
    console.log("Sauvegarde des paramètres...", settings);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Paramètres Système
          </h1>
          <p className="text-muted-foreground">
            Configuration et gestion des paramètres de l'application ANSSI
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSaveSettings}>
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
        </div>
      </div>

      {/* Contenu principal avec onglets */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="accreditations">Types d'accréditation</TabsTrigger>
          <TabsTrigger value="workflow">Workflows</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>Paramètres généraux</span>
              </CardTitle>
              <CardDescription>
                Configuration de base de l'application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="site_name">Nom du site</Label>
                  <Input
                    id="site_name"
                    value={settings.general.site_name}
                    onChange={(e) => handleSettingChange('general', 'site_name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_email">Email de contact</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={settings.general.contact_email}
                    onChange={(e) => handleSettingChange('general', 'contact_email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Téléphone</Label>
                  <Input
                    id="contact_phone"
                    value={settings.general.contact_phone}
                    onChange={(e) => handleSettingChange('general', 'contact_phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuseau horaire</Label>
                  <Select 
                    value={settings.general.timezone} 
                    onValueChange={(value) => handleSettingChange('general', 'timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Conakry">Afrique/Conakry</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="site_description">Description du site</Label>
                <Textarea
                  id="site_description"
                  value={settings.general.site_description}
                  onChange={(e) => handleSettingChange('general', 'site_description', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  value={settings.general.address}
                  onChange={(e) => handleSettingChange('general', 'address', e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="maintenance_mode"
                  checked={settings.general.maintenance_mode}
                  onCheckedChange={(checked) => handleSettingChange('general', 'maintenance_mode', checked)}
                />
                <Label htmlFor="maintenance_mode">Mode maintenance</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accreditations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Types d'accréditation</span>
                </span>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau type
                </Button>
              </CardTitle>
              <CardDescription>
                Gestion des types d'accréditation ANSSI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {accreditationTypes.map((type) => (
                  <div key={type.slug} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium">{type.name}</h3>
                          <Badge variant={type.status === "active" ? "default" : "secondary"}>
                            {type.status === "active" ? "Actif" : "Inactif"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{type.description}</p>
                        
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Exigences</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {type.requirements.map((req, index) => (
                                <li key={index} className="flex items-start space-x-2">
                                  <CheckCircle className="h-3 w-3 mt-0.5 text-green-500" />
                                  <span>{req}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-2">Frais</h4>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <div>Traitement: {type.fees.processing.toLocaleString()} GNF</div>
                              <div>Annuel: {type.fees.annual.toLocaleString()} GNF</div>
                              <div>Durée: {type.duration} mois</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Configuration des workflows</span>
              </CardTitle>
              <CardDescription>
                Paramètres des processus d'accréditation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="auto_approval"
                  checked={settings.workflow.auto_approval}
                  onCheckedChange={(checked) => handleSettingChange('workflow', 'auto_approval', checked)}
                />
                <Label htmlFor="auto_approval">Approbation automatique</Label>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="review_duration">Durée de révision (jours)</Label>
                  <Input
                    id="review_duration"
                    type="number"
                    value={settings.workflow.review_duration}
                    onChange={(e) => handleSettingChange('workflow', 'review_duration', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="escalation_days">Délai d'escalation (jours)</Label>
                  <Input
                    id="escalation_days"
                    type="number"
                    value={settings.workflow.escalation_days}
                    onChange={(e) => handleSettingChange('workflow', 'escalation_days', parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="escalation_enabled"
                  checked={settings.workflow.escalation_enabled}
                  onCheckedChange={(checked) => handleSettingChange('workflow', 'escalation_enabled', checked)}
                />
                <Label htmlFor="escalation_enabled">Escalade automatique</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Paramètres de notifications</span>
              </CardTitle>
              <CardDescription>
                Configuration des alertes et notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Types de notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="email_notifications"
                      checked={settings.notifications.email_notifications}
                      onCheckedChange={(checked) => handleSettingChange('notifications', 'email_notifications', checked)}
                    />
                    <Label htmlFor="email_notifications">Notifications par email</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="sms_notifications"
                      checked={settings.notifications.sms_notifications}
                      onCheckedChange={(checked) => handleSettingChange('notifications', 'sms_notifications', checked)}
                    />
                    <Label htmlFor="sms_notifications">Notifications SMS</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="push_notifications"
                      checked={settings.notifications.push_notifications}
                      onCheckedChange={(checked) => handleSettingChange('notifications', 'push_notifications', checked)}
                    />
                    <Label htmlFor="push_notifications">Notifications push</Label>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-medium">Événements à notifier</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="new_accreditation"
                      checked={settings.notifications.new_accreditation}
                      onCheckedChange={(checked) => handleSettingChange('notifications', 'new_accreditation', checked)}
                    />
                    <Label htmlFor="new_accreditation">Nouvelle demande d'accréditation</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="status_change"
                      checked={settings.notifications.status_change}
                      onCheckedChange={(checked) => handleSettingChange('notifications', 'status_change', checked)}
                    />
                    <Label htmlFor="status_change">Changement de statut</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="document_validation"
                      checked={settings.notifications.document_validation}
                      onCheckedChange={(checked) => handleSettingChange('notifications', 'document_validation', checked)}
                    />
                    <Label htmlFor="document_validation">Validation de documents</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="system_alerts"
                      checked={settings.notifications.system_alerts}
                      onCheckedChange={(checked) => handleSettingChange('notifications', 'system_alerts', checked)}
                    />
                    <Label htmlFor="system_alerts">Alertes système</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Paramètres de sécurité</span>
              </CardTitle>
              <CardDescription>
                Configuration de la sécurité et des accès
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="password_min_length">Longueur minimale du mot de passe</Label>
                  <Input
                    id="password_min_length"
                    type="number"
                    value={settings.security.password_min_length}
                    onChange={(e) => handleSettingChange('security', 'password_min_length', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="session_timeout">Délai d'expiration de session (minutes)</Label>
                  <Input
                    id="session_timeout"
                    type="number"
                    value={settings.security.session_timeout}
                    onChange={(e) => handleSettingChange('security', 'session_timeout', parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="password_require_special"
                    checked={settings.security.password_require_special}
                    onCheckedChange={(checked) => handleSettingChange('security', 'password_require_special', checked)}
                  />
                  <Label htmlFor="password_require_special">Exiger des caractères spéciaux</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="two_factor_auth"
                    checked={settings.security.two_factor_auth}
                    onCheckedChange={(checked) => handleSettingChange('security', 'two_factor_auth', checked)}
                  />
                  <Label htmlFor="two_factor_auth">Authentification à deux facteurs</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="ip_whitelist"
                    checked={settings.security.ip_whitelist}
                    onCheckedChange={(checked) => handleSettingChange('security', 'ip_whitelist', checked)}
                  />
                  <Label htmlFor="ip_whitelist">Liste blanche IP</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="audit_logs"
                    checked={settings.security.audit_logs}
                    onCheckedChange={(checked) => handleSettingChange('security', 'audit_logs', checked)}
                  />
                  <Label htmlFor="audit_logs">Journaux d'audit</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
