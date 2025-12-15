import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, Upload, Loader2, AlertCircle } from 'lucide-react';
import { apiService } from '@/services/api';
import type { IssueCategory } from '@/types';

export default function ReportIssue() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState<IssueCategory>('fallenTree');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category || !description || !location || !photoFile) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const photoUrl = reader.result as string;
        
        await apiService.reportIssue({
          category,
          description,
          location,
          photoUrl,
          isEmergency,
        });

        toast.success(t('issues.reportSuccess'));
        navigate('/issues');
      };
      reader.readAsDataURL(photoFile);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to report issue');
      setIsLoading(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  const categories: IssueCategory[] = ['fallenTree', 'openManhole', 'floodedRoad', 'garbageOverflow', 'other'];

  return (
    <div className="min-h-screen bg-muted pb-20 md:pb-8">
      <div className="bg-accent text-accent-foreground py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-4 text-accent-foreground hover:bg-accent-foreground/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('common.back')}
          </Button>
          <h1 className="text-3xl font-bold">{t('issues.reportIssue')}</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="w-6 h-6" />
              <span>{t('issues.issueDetails')}</span>
            </CardTitle>
            <CardDescription>
              Report a civic issue or emergency hazard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="photo">{t('common.uploadImage')} *</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent transition-colors">
                  {photoPreview ? (
                    <div className="space-y-4">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="max-h-64 mx-auto rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setPhotoFile(null);
                          setPhotoPreview('');
                        }}
                      >
                        Change Photo
                      </Button>
                    </div>
                  ) : (
                    <label htmlFor="photo" className="cursor-pointer block">
                      <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Click to upload or drag and drop
                      </p>
                      <input
                        id="photo"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                        disabled={isLoading}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">{t('issues.category')} *</Label>
                <Select value={category} onValueChange={(value) => setCategory(value as IssueCategory)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {t(`issues.categories.${cat}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t('issues.description')} *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue in detail..."
                  rows={4}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">{t('issues.location')} *</Label>
                <Input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., MG Road, Bangalore"
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="space-y-0.5">
                  <Label htmlFor="emergency">{t('issues.markEmergency')}</Label>
                  <p className="text-sm text-muted-foreground">
                    Mark this as an urgent issue requiring immediate attention
                  </p>
                </div>
                <Switch
                  id="emergency"
                  checked={isEmergency}
                  onCheckedChange={setIsEmergency}
                  disabled={isLoading}
                />
              </div>

              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {t('common.cancel')}
                </Button>
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t('common.submit')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
