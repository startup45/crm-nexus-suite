
import React, { useState } from 'react';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { FileIcon, FileText, FolderIcon, MoreHorizontal, Search, Upload } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  createdAt: string;
  createdBy: string;
}

const Documents = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample documents data
  const documents: Document[] = [
    {
      id: '1',
      name: 'Project Proposal.pdf',
      type: 'pdf',
      size: 2540000, // 2.54 MB
      createdAt: '2024-04-15T10:30:00',
      createdBy: 'John Manager'
    },
    {
      id: '2',
      name: 'Financial Report Q1.xlsx',
      type: 'excel',
      size: 1800000, // 1.8 MB
      createdAt: '2024-04-10T14:45:00',
      createdBy: 'System Administrator'
    },
    {
      id: '3',
      name: 'Client Meeting Notes.docx',
      type: 'word',
      size: 856000, // 856 KB
      createdAt: '2024-05-01T09:15:00',
      createdBy: 'Jane Employee'
    },
    {
      id: '4',
      name: 'Brand Guidelines.pdf',
      type: 'pdf',
      size: 5200000, // 5.2 MB
      createdAt: '2024-03-22T11:20:00',
      createdBy: 'Jane Employee'
    },
    {
      id: '5',
      name: 'Marketing Strategy.pptx',
      type: 'powerpoint',
      size: 3400000, // 3.4 MB
      createdAt: '2024-04-28T16:10:00',
      createdBy: 'John Manager'
    }
  ];

  // Filter documents by search query
  const filteredDocuments = searchQuery
    ? documents.filter(doc => 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        doc.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : documents;

  // Function to format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Function to get file icon
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileIcon className="h-5 w-5 text-red-500" />;
      case 'excel':
        return <FileIcon className="h-5 w-5 text-green-500" />;
      case 'word':
        return <FileIcon className="h-5 w-5 text-blue-500" />;
      case 'powerpoint':
        return <FileIcon className="h-5 w-5 text-orange-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <FolderIcon className="h-4 w-4" />
              <span>New Folder</span>
            </Button>
            <Button className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span>Upload</span>
            </Button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Documents</CardTitle>
            <CardDescription>Manage and access your organization's files.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {getFileIcon(doc.type)}
                        <span>{doc.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{doc.type}</TableCell>
                    <TableCell>{formatFileSize(doc.size)}</TableCell>
                    <TableCell>{formatDate(doc.createdAt)}</TableCell>
                    <TableCell>{doc.createdBy}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>Download</DropdownMenuItem>
                          <DropdownMenuItem>Share</DropdownMenuItem>
                          <DropdownMenuItem>Rename</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredDocuments.length === 0 && (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No documents found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Documents;
