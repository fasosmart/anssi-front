"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CheckCircle, AlertTriangle } from "lucide-react";

interface SubmitEntityConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  entityName: string;
}

export function SubmitEntityConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  entityName
}: SubmitEntityConfirmationDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
              <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <AlertDialogTitle className="text-left">
                Soumettre pour validation
              </AlertDialogTitle>
            </div>
          </div>
          {/* ✅ Solution : Laisser AlertDialogDescription vide et mettre le contenu après */}
          <AlertDialogDescription className="sr-only">
            Dialogue de confirmation pour soumettre une structure
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        {/* ✅ Contenu déplacé en dehors de AlertDialogDescription */}
        <div className="space-y-3 px-6 text-sm text-muted-foreground">
          <div>
            Vous êtes sur le point de soumettre <strong>{entityName}</strong> pour validation.
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <div className="font-medium text-blue-900 dark:text-blue-100">
                  Après soumission :
                </div>
                <ul className="mt-1 space-y-1 text-blue-700 dark:text-blue-300">
                  <li>• Votre structure passera en &quot;En cours de validation&quot;</li>
                  <li>• Vous ne pourrez plus modifier ses informations</li>
                  <li>• Nos équipes examineront votre dossier</li>
                  <li>• Vous recevrez une notification du résultat</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="text-sm font-medium text-amber-700 dark:text-amber-300">
            ⚠️ Assurez-vous que toutes les informations sont correctes avant de continuer.
          </div>
        </div>

        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel disabled={isLoading}>
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90"
          >
            {isLoading ? "Soumission..." : "Confirmer la soumission"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}