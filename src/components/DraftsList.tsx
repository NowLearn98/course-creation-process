import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { 
  Edit, 
  Trash2, 
  Clock, 
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

  const getTotalDuration = (draft: DraftCourse) => {
    const hours = parseInt(draft.durationHours) || 0;
    const minutes = parseInt(draft.durationMinutes) || 0;
    const totalMinutes = hours * 60 + minutes;
    
    if (totalMinutes === 0) return 'Duration not set';
    if (totalMinutes >= 60) {
      const h = Math.floor(totalMinutes / 60);
      const m = totalMinutes % 60;
      return m > 0 ? `${h}h ${m}m` : `${h}h`;
    }
    return `${totalMinutes}m`;
  };

  if (drafts.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <BookOpen className="w-12 h-12 text-muted-foreground" />
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No Drafts Yet</h3>
            <p className="text-muted-foreground">
              Start creating a course and save it as a draft to see it here.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drafts.map((draft) => (
          <Card key={draft.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold line-clamp-2 mb-1">
                    {draft.title || 'Untitled Course'}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {draft.subtitle || 'No subtitle provided'}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEditDraft(draft)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDeleteDraft(draft.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                  Draft
                </Badge>
                {draft.level && (
                  <Badge variant="outline">
                    {draft.level}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {getTotalDuration(draft)}
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {draft.modules.length} modules
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {draft.category || 'No category'}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Updated: {formatDate(draft.updatedAt)}
                  </span>
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