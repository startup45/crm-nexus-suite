
import React, { useState } from 'react';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from '@/components/ui/card';
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useTheme } from '@/contexts/ThemeContext';
import { useStore } from '@/lib/store';
import { Sun, Moon } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { currentUser } = useStore();
  
  const [activeTab, setActiveTab] = useState('account');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [desktopNotifications, setDesktopNotifications] = useState(true);
  const [offlineAccess, setOfflineAccess] = useState(false);
  const [savedChanges, setSavedChanges] = useState(false);

  // Handle form submissions
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update the user profile
    setSavedChanges(true);
    setTimeout(() => setSavedChanges(false), 3000);
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update notification settings
    setSavedChanges(true);
    setTimeout(() => setSavedChanges(false), 3000);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 sm:grid-cols-4">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          {/* Account Settings */}
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your account details and profile information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" defaultValue={currentUser?.fullName || ''} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue={currentUser?.email || ''} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input id="role" disabled defaultValue={currentUser?.role || ''} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea id="bio" placeholder="A brief description about yourself" />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="public-profile" />
                      <Label htmlFor="public-profile">Make my profile visible to other team members</Label>
                    </div>

                    <Button type="submit">Save Changes</Button>
                    
                    {savedChanges && (
                      <p className="text-sm text-green-600 mt-2">Your changes have been saved successfully!</p>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Appearance Settings */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize the appearance of the application.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Theme</Label>
                      <p className="text-sm text-muted-foreground">Switch between light and dark themes.</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={toggleTheme}
                      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
                    >
                      {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Sidebar Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">Use a more compact sidebar layout.</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>High Contrast Mode</Label>
                      <p className="text-sm text-muted-foreground">Increase contrast for better visibility.</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Reduce Motion</Label>
                      <p className="text-sm text-muted-foreground">Minimize animations and transitions.</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveNotifications}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via email.</p>
                      </div>
                      <Switch 
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                    </div>

                    {emailNotifications && (
                      <div className="ml-6 space-y-2 border-l-2 border-muted pl-4 pt-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="email-tasks" defaultChecked />
                          <Label htmlFor="email-tasks">Task assignments and updates</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="email-projects" defaultChecked />
                          <Label htmlFor="email-projects">Project updates</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="email-messages" defaultChecked />
                          <Label htmlFor="email-messages">New messages</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="email-security" defaultChecked />
                          <Label htmlFor="email-security">Security alerts</Label>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Desktop Notifications</Label>
                        <p className="text-sm text-muted-foreground">Show notifications in your browser.</p>
                      </div>
                      <Switch 
                        checked={desktopNotifications}
                        onCheckedChange={setDesktopNotifications}
                      />
                    </div>

                    {desktopNotifications && (
                      <div className="ml-6 space-y-2 border-l-2 border-muted pl-4 pt-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="desktop-messages" defaultChecked />
                          <Label htmlFor="desktop-messages">New messages</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="desktop-tasks" defaultChecked />
                          <Label htmlFor="desktop-tasks">Task deadlines</Label>
                        </div>
                      </div>
                    )}

                    <Button type="submit">Save Notification Preferences</Button>

                    {savedChanges && (
                      <p className="text-sm text-green-600 mt-2">Your notification preferences have been updated!</p>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Security Settings */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>
                  Manage your account security settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Password</h3>
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <Button type="button">Change Password</Button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p>Status: <span className="font-semibold text-red-500">Not Enabled</span></p>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account.
                      </p>
                    </div>
                    <Button variant="outline">Setup 2FA</Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Session Management</h3>
                  <div className="space-y-0.5">
                    <p>Current session: <span className="font-semibold text-green-500">Active</span></p>
                    <p className="text-sm text-muted-foreground">
                      Last login: May 4, 2024 - 10:30 AM from Chrome on Windows
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline">Sign Out All Devices</Button>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Offline Access</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p>Enable Offline Access</p>
                      <p className="text-sm text-muted-foreground">
                        Store data locally to use the app when offline.
                      </p>
                    </div>
                    <Switch 
                      checked={offlineAccess}
                      onCheckedChange={setOfflineAccess}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
