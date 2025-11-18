## Gestion des groupes côté admin

> Dernière mise à jour : 18/11/2025  
> Contacts : Équipe Front Admin (`dashboard/admin`)

Cette note décrit le flux complet de gestion des groupes depuis l’interface admin. Elle couvre à la fois l’expérience **détail utilisateur** (Actions unitaires) et la **liste des utilisateurs** (Actions en masse).

---

### 1. Objectifs UX

- Offrir une vue claire des groupes associés à un utilisateur.
- Permettre l’ajout ou la suppression de groupes sans quitter l’interface en cours.
- Supporter les opérations en masse pour accélérer les gestions administratives.
- Garantir un feedback explicite (skeletons, toasts, états de chargement).

---

### 2. Vue détail utilisateur (`/dashboard/admin/users/[slug]`)

**Composants clés**
1. **Onglet `Permissions & groupes`**
   - Carte “Groupes rattachés” : liste actualisée des groupes, avec skeleton si chargement.
   - Carte “Ajouter aux groupes” : sélection multi-checkbox des groupes disponibles (exclut ceux déjà attribués).
   - Carte “Retirer des groupes” : affichée uniquement si l’utilisateur possède au moins un groupe.

2. **Hooks & états**
   - `availableGroups`, `isLoadingGroups`: chargement des groupes via `AdminAPI.listGroupPermissions`.
   - `selectedGroupsToAdd`, `selectedGroupsToRemove`: collection des ids à traiter.
   - `isManagingGroups`: verrouille les boutons durant les requêtes.

3. **APIs consommées**
   - `AdminAPI.addGroupsToUsers([slug], groupIds)`
   - `AdminAPI.removeGroupsFromUsers([slug], groupIds)`

4. **Feedback**
   - Toast succès/erreur contextualisé (`toast.success`, `toast.error`).
   - Skeletons pour les listes, badges informatifs, état disabled des boutons.

5. **Rafraîchissement**
   - Après action, `refetch()` recharge les données utilisateur pour refléter l’état backend.

---

### 3. Vue liste utilisateurs (`/dashboard/admin/users`)

**Étapes UX**
1. **Sélection**
   - Checkbox ligne + checkbox d’en-tête.
   - Barre flottante qui apparaît dès qu’au moins un utilisateur est sélectionné.

2. **Barre d’actions flottante**
   - Affiche le nombre d’utilisateurs sélectionnés.
   - Boutons “Ajouter aux groupes”, “Retirer des groupes”, “Annuler”.
   - Animation “slide-in” pour attirer l’attention sans gêner la lecture.

3. **Modal/Dialogue de gestion**
   - Ouvert via la barre d’actions.
   - Liste scrollable des groupes (`AdminAPI.listGroupPermissions`).
   - Checkboxes pour choisir les groupes ciblés.
   - Compteur dynamique du nombre de groupes sélectionnés.
   - Boutons d’action (variant selon add/remove) avec état de chargement.

4. **APIs consommées**
   - Identiques à la page détail, mais la payload `users` peut contenir plusieurs slugs.

5. **Feedback**
   - Toast succès/erreur, y compris en cas de validation côté backend.
   - Skeletons lors du chargement des groupes.
   - Rappel visuel via la barre flottante si une action est en attente.

6. **Rafraîchissement**
   - Après action, rafraîchissement de la liste (`fetchUsers`) + remise à zéro de la sélection.

---

### 4. États & gestion des erreurs

| Contexte                 | Feedback visuel                                    |
|-------------------------|----------------------------------------------------|
| Chargement de la liste  | Skeletons (header, filtres, cartes, tableau)       |
| Chargement des groupes  | Skeletons dans les sections/médiane                |
| Action en cours         | Boutons désactivés + libellés “En cours…”          |
| Succès                  | Toast vert (`toast.success`)                       |
| Échec                   | Toast rouge (`toast.error`) avec message backend   |

---

### 5. Endpoints utilisés

| Endpoint                                                        | Usage                                         |
|-----------------------------------------------------------------|-----------------------------------------------|
| `GET /api/administrations/list-group-permissions/`              | Charger la liste des groupes disponibles      |
| `POST /api/administrations/permissions/add_permissions_to_user/`| Ajouter un ou plusieurs groupes à des users   |
| `PATCH /api/administrations/permissions/remove_permissions_to_user/`| Retirer des groupes à des users          |

---

### 6. TODO / évolutions envisagées

- Ajouter, dans les modales de la liste, un indicateur des groupes déjà présents pour tout ou partie de la sélection (afin d’éviter d’ajouter des doublons).
- Harmoniser les toasts (contenu + ton) entre les pages liste et détail.
- Supporter la pagination/filtre des groupes si la liste devient conséquente.
- Ajouter une colonne “Groupes” dans le tableau principal pour donner un aperçu direct du nombre de groupes par utilisateur.

---

### 7. Points de vigilance

- Vérifier les permissions backend (certains endpoints nécessitent `is_staff` ou `can_edit_staff`).
 - Protéger les actions critiques avec confirmation si besoin (suppression d’un groupe sensible à l’avenir).
- Garder en tête l’accessibilité : focus visible sur les checkboxes, roles, aria-labels déjà posés.

---

Pour toute évolution majeure, compléter cette documentation et indiquer la date de mise à jour.

