import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { 
  Edit, 
  Trash2, 
  BookOpen, 
  Users, 
  MoreHorizontal,
  Eye
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getDrafts, deleteDraft } from '@/utils/draftStorage';
import { DraftCourse } from '@/types/draft';
import { useToast } from '@/hooks/use-toast';

interface DraftsListProps {
  onEditDraft: (draft: DraftCourse) => void;
}

export function DraftsList({ onEditDraft }: DraftsListProps) {
  const [drafts, setDrafts] = useState<DraftCourse[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [draftToDelete, setDraftToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadDrafts();
  }, []);

  const loadDrafts = () => {
    const savedDrafts = getDrafts();
    setDrafts(savedDrafts);
  };

  const handleDeleteDraft = (id: string) => {
    setDraftToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (draftToDelete) {
      const success = deleteDraft(draftToDelete);
      if (success) {
        setDrafts(prev => prev.filter(d => d.id !== draftToDelete));
        toast({
          title: "Draft Deleted",
          description: "The draft has been successfully deleted.",
        });
      }
    }
    setDeleteDialogOpen(false);
    setDraftToDelete(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (drafts.length === 0) {
    return (
      <Card className="p-12 text-center border-dashed border-2 bg-gradient-to-br from-muted/20 to-transparent">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-primary/10 rounded-full">
            <BookOpen className="w-12 h-12 text-primary" />
          </div>
          <div className="max-w-md">
            <h3 className="text-xl font-bold text-foreground mb-2">No Drafts Yet</h3>
            <p className="text-muted-foreground">
              Start creating a course and save it as a draft to see it here. Your drafts are automatically saved.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {drafts.map((draft) => (
          <Card key={draft.id} className="group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="relative pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base md:text-lg font-bold line-clamp-2 mb-2 text-foreground group-hover:text-primary transition-colors">
                    {draft.title || 'Untitled Course'}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 text-sm">
                    {draft.subtitle || 'No subtitle provided'}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-primary/10 transition-colors">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-popover/95 backdrop-blur-sm border shadow-lg">
                    <DropdownMenuItem onClick={() => onEditDraft(draft)} className="cursor-pointer">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Draft
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDeleteDraft(draft.id)}
                      className="text-destructive focus:text-destructive cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 shadow-sm">
                  Draft
                </Badge>
                {draft.level && (
                  <Badge variant="outline" className="shadow-sm">
                    {draft.level}
                  </Badge>
                )}
                {draft.category && (
                  <Badge variant="outline" className="shadow-sm text-xs">
                    {draft.category}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="relative pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <div className="p-1 bg-primary/10 rounded">
                      <BookOpen className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="font-medium">{draft.modules.length} modules</span>
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <span>Last updated:</span>
                    <span className="font-medium text-foreground">{formatDate(draft.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Draft</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this draft? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}