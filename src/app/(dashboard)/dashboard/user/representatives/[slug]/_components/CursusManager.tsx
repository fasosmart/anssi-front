"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";
import { CursusItemDialog } from "./CursusItemDialog";
import { DeleteConfirmationDialog } from "../../_components/DeleteConfirmationDialog";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { useMediaQuery } from "@/hooks/use-media-query";

type GenericItem = Record<string, unknown> & { slug?: string };

interface CursusManagerProps {
  itemType: 'degree' | 'training' | 'experience';
  listApiEndpoint: string;
  itemApiEndpoint: (itemId?: string) => string;
  columns: { key: string; header: string; render?: (item: GenericItem) => React.ReactNode }[];
  title: string;
  description: string;
}

export function CursusManager({ itemType, listApiEndpoint, itemApiEndpoint, columns, title, description }: CursusManagerProps) {
  const [items, setItems] = useState<GenericItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GenericItem | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(listApiEndpoint);
      setItems(response.data.results || []);
    } catch {
      toast.error(`Erreur lors de la récupération de la liste.`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [listApiEndpoint]);
  
  const handleAdd = () => {
    setSelectedItem(null);
    setIsDialogOpen(true);
  };
  
  const handleEdit = (item: GenericItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleDelete = (item: GenericItem) => {
    setSelectedItem(item);
    setIsDeleteAlertOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedItem?.slug) return;
    try {
        await apiClient.delete(itemApiEndpoint(selectedItem.slug));
        toast.success("Élément supprimé avec succès.");
        fetchData();
    } catch {
        toast.error("Erreur lors de la suppression.");
    } finally {
        setIsDeleteAlertOpen(false);
        setSelectedItem(null);
    }
  }

  const handleSuccess = () => {
    setIsDialogOpen(false);
    setSelectedItem(null);
    fetchData();
  };
  
  const handleRowClick = (item: GenericItem) => {
    // This is a simplified navigation. It assumes a nested URL structure.
    // e.g., /representatives/[slug]/degrees/[degreeSlug]
    router.push(`${window.location.pathname}/${itemType}s/${String(item.slug)}`);
  }

  const CursusRow = ({ item, index }: { item: GenericItem; index: number }) => (
    <TableRow key={item.slug} onClick={() => handleRowClick(item)} className="cursor-pointer">
      <TableCell onClick={(e) => e.stopPropagation()}><Checkbox /></TableCell>
      <TableCell>{index + 1}</TableCell>
      {columns.map(col => (
        <TableCell key={col.key} className="font-medium">
          {col.render ? col.render(item) : String(item[col.key] ?? '')}
        </TableCell>
      ))}
      <TableCell onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /><span className="sr-only">Menu</span></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onSelect={() => handleEdit(item)}>Modifier</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleDelete(item)} className="text-red-600">Supprimer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );

  const CursusCard = ({ item }: { item: GenericItem }) => (
     <Card key={item.slug} className="mb-4">
        <CardHeader>
            <div className="flex justify-between items-start">
                 <CardTitle className="text-lg">{String(item[columns[0].key] ?? '')}</CardTitle>
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onSelect={() => handleRowClick(item)}>Voir les détails</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleEdit(item)}>Modifier</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(item)} className="text-red-600">
                            Supprimer
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <CardDescription>{String(item[columns[1].key] ?? '')}</CardDescription>
        </CardHeader>
        <CardContent className="text-sm space-y-2" onClick={() => handleRowClick(item)}>
            {columns.slice(2).map(col => (
                 <div className="flex justify-between" key={col.key}>
                    <span className="font-semibold text-muted-foreground">{col.header}:</span>
                    <span>{String(item[col.key] ?? '')}</span>
                </div>
            ))}
        </CardContent>
    </Card>
  );

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </div>
        <Button onClick={handleAdd}><PlusCircle className="mr-2 h-4 w-4"/>Ajouter</Button>
      </CardHeader>
      <CardContent>
        {isMobile ? (
          <div className="space-y-4 mt-4">
            {isLoading ? (
              <p>Chargement...</p>
            ) : items.length > 0 ? (
              items.map((item) => <CursusCard key={item.slug} item={item} />)
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Aucun élément trouvé.
              </div>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]"><Checkbox /></TableHead>
                <TableHead className="w-[50px]">#</TableHead>
                {columns.map(col => <TableHead key={col.key}>{col.header}</TableHead>)}
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={columns.length + 3} className="h-24 text-center">Chargement...</TableCell></TableRow>
              ) : items.length > 0 ? (
                items.map((item, index: number) => (
                  <CursusRow key={item.slug} item={item} index={index} />
                ))
              ) : (
                <TableRow><TableCell colSpan={columns.length + 3} className="h-24 text-center">Aucun élément trouvé.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <CursusItemDialog 
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        onSuccess={handleSuccess}
        item={selectedItem}
        itemType={itemType}
        apiEndpoint={itemApiEndpoint}
      />
      <DeleteConfirmationDialog
        isOpen={isDeleteAlertOpen}
        onOpenChange={setIsDeleteAlertOpen}
        onConfirm={confirmDelete}
        itemName={String((selectedItem?.['degree_name'] ?? selectedItem?.['training_name'] ?? selectedItem?.['job_title'] ?? ''))}
      />
    </Card>
  );
}
