'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, ShieldAlert, Monitor, Smartphone, Trash2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function SecuritySettingsPage() {
  const user = useAuthStore(state => state.user);

  // 2FA State
  const [is2FAEnabled, setIs2FAEnabled] = useState(false); // Should really come from user context, assuming false for now if not present
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [setupSecret, setSetupSecret] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [isSettingUp2FA, setIsSettingUp2FA] = useState(false);

  // Session State
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await api.get('/sessions');
      setSessions(res.data);
    } catch (err) {
      console.error('Error fetching sessions', err);
    }
  };

  const init2FASetup = async () => {
    try {
      const res = await api.post('/auth/2fa/setup');
      setQrCodeUrl(res.data.qrCodeUrl);
      setSetupSecret(res.data.secret);
      setIsSettingUp2FA(true);
    } catch (err) {
      console.error('Error setting up 2FA', err);
    }
  };

  const verify2FA = async () => {
    try {
      await api.post('/auth/2fa/verify', { token: totpCode });
      setIs2FAEnabled(true);
      setIsSettingUp2FA(false);
      setTotpCode('');
      alert('2FA Enabled Successfully!');
    } catch (err) {
      alert('Invalid code');
    }
  };

  const disable2FA = async () => {
    try {
      await api.post('/auth/2fa/disable', { token: totpCode });
      setIs2FAEnabled(false);
      setTotpCode('');
      alert('2FA Disabled Successfully!');
    } catch (err) {
      alert('Invalid code');
    }
  };

  const revokeSession = async (id: string) => {
    try {
      await api.delete(`/sessions/${id}`);
      fetchSessions();
    } catch (err) {
      console.error('Error revoking session', err);
    }
  };

  const revokeAllOtherSessions = async () => {
    try {
      await api.delete('/sessions/all');
      fetchSessions();
    } catch (err) {
      console.error('Error revoking all other sessions', err);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-md tracking-tight text-zinc-900">Security Settings</h1>
        <p className="text-zinc-500 mt-2">Manage your account security, two-factor authentication, and active sessions.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {is2FAEnabled ? <Shield className="text-green-600" /> : <ShieldAlert className="text-amber-500" />}
            Two-Factor Authentication (2FA)
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account by requiring a verification code in addition to your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!is2FAEnabled ? (
            !isSettingUp2FA ? (
              <Button onClick={init2FASetup}>Set up 2FA</Button>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col items-center p-4 bg-zinc-50 rounded-lg max-w-xs">
                  <img src={qrCodeUrl} alt="2FA QR Code" className="w-48 h-48 mb-4" />
                  <p className="text-sm font-mono text-center break-all">{setupSecret}</p>
                </div>
                <div className="space-y-2 max-w-xs">
                  <Input
                    placeholder="Enter 6-digit code"
                    value={totpCode}
                    onChange={e => setTotpCode(e.target.value)}
                    maxLength={6}
                  />
                  <Button onClick={verify2FA} className="w-full">Verify & Enable</Button>
                  <Button variant="ghost" onClick={() => setIsSettingUp2FA(false)} className="w-full">Cancel</Button>
                </div>
              </div>
            )
          ) : (
            <div className="space-y-4 max-w-xs">
              <p className="text-sm text-green-600 font-medium">2FA is currently enabled.</p>
              <div className="space-y-2">
                <Input
                  placeholder="Enter 6-digit code to disable"
                  value={totpCode}
                  onChange={e => setTotpCode(e.target.value)}
                  maxLength={6}
                />
                <Button variant="destructive" onClick={disable2FA} className="w-full">Disable 2FA</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Active Sessions</CardTitle>
            <CardDescription>
              View and manage the devices currently logged into your account.
            </CardDescription>
          </div>
          <Button variant="outline" onClick={revokeAllOtherSessions}>Revoke All Other Sessions</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session._id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-zinc-100 rounded-full">
                    {session.browser?.toLowerCase().includes('mobile') ? <Smartphone className="w-5 h-5 text-zinc-600" /> : <Monitor className="w-5 h-5 text-zinc-600" />}
                  </div>
                  <div>
                    <p className="font-medium text-zinc-900">{session.browser || 'Unknown Device'}</p>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <span>IP: {session.ipAddress || 'Unknown'}</span>
                      <span>•</span>
                      <span>Last active: {new Date(session.lastActive).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => revokeSession(session._id)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Revoke
                </Button>
              </div>
            ))}
            {sessions.length === 0 && (
              <p className="text-sm text-zinc-500">No active sessions found.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
