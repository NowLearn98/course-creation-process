import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Edit, Trash2, Clock, BookOpen, Users } from 'lucide-react';
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
    
    if (hours === 0 && minutes === 0) return 'Duration not set';
    if (hours === 0) return `${minutes} min`;
    if (minutes === 0) return `${hours} hr`;
    return `${hours} hr ${minutes} min`;
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">My Course Drafts</h2>
        <Badge variant="secondary">{drafts.length} draft{drafts.length !== 1 ? 's' : ''}</Badge>
      </div>
      
      <div className="grid gap-4">
        {drafts.map((draft) => (
          <Card key={draft.id} className="hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">
                    {draft.title || 'Untitled Course'}
                  </CardTitle>
                  {draft.subtitle && (
                    <p className="text-sm text-muted-foreground mb-2">{draft.subtitle}</p>
                  )}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {draft.level && (
                      <Badge variant="outline">{draft.level}</Badge>
                    )}
                    {draft.category && (
                      <Badge variant="outline">{draft.category}</Badge>
                    )}
                    {draft.language && (
                      <Badge variant="outline">{draft.language}</Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => onEditDraft(draft)}
                    size="sm"
                    variant="outline"
                    className="shrink-0"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteDraft(draft.id)}
                    size="sm"
                    variant="outline"
                    className="shrink-0 text-destructive hover:text-destructive-foreground hover:bg-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                {draft.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {draft.description}
                  </p>
                )}
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{getTotalDuration(draft)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span>{draft.modules.length} module{draft.modules.length !== 1 ? 's' : ''}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {draft.sessionTypes.length === 0 
                        ? 'No sessions' 
                        : draft.sessionTypes.join(', ')}
                    </span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Created: {formatDate(draft.createdAt)}</span>
                  <span>Updated: {formatDate(draft.updatedAt)}</span>
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
    </div>
  );
}