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

interface CursusManagerProps {
  itemType: 'degree' | 'training' | 'experience';
  listApiEndpoint: string;
  itemApiEndpoint: (itemId?: string) => string;
  columns: { key: string; header: string; render?: (item: any) => React.ReactNode }[];
  title: string;
  description: string;
}

export function CursusManager({ itemType, listApiEndpoint, itemApiEndpoint, columns, title, description }: CursusManagerProps) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const router = useRouter();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(listApiEndpoint);
      setItems(response.data.results || []);
    } catch (error) {
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
  
  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleDelete = (item: any) => {
    setSelectedItem(item);
    setIsDeleteAlertOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedItem?.slug) return;
    try {
        await apiClient.delete(itemApiEndpoint(selectedItem.slug));
        toast.success("Élément supprimé avec succès.");
        fetchData();
    } catch(error) {
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
  
  const handleRowClick = (item: any) => {
    // This is a simplified navigation. It assumes a nested URL structure.
    // e.g., /representatives/[slug]/degrees/[degreeSlug]
    router.push(`${window.location.pathname}/${itemType}s/${item.slug}`);
  }

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
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(col => <TableHead key={col.key}>{col.header}</TableHead>)}
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={columns.length + 1} className="h-24 text-center">Chargement...</TableCell></TableRow>
            ) : items.length > 0 ? (
              items.map((item: any) => (
                <TableRow key={item.slug} onClick={() => handleRowClick(item)} className="cursor-pointer">
                  {columns.map(col => (
                    <TableCell key={col.key} className="font-medium">
                      {col.render ? col.render(item) : item[col.key]}
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
              ))
            ) : (
              <TableRow><TableCell colSpan={columns.length + 1} className="h-24 text-center">Aucun élément trouvé.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
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
        itemName={selectedItem?.degree_name || selectedItem?.training_name || selectedItem?.job_title || ''}
      />
    </Card>
  );
}
