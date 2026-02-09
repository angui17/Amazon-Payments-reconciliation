// import React, { useEffect, useMemo, useState } from 'react'
// import { useAuth } from '../../context/AuthContext'
// import '../../styles/user-profile.css' 

// const DEFAULTS = {
//   fullName: '',
//   email: '',
//   phone: '',
//   department: '',
//   jobTitle: '',
//   notifications: {
//     email: true,
//     sms: false,
//     criticalOnly: true,
//     dailySummary: true,
//     weeklyPerformance: false,
//   },
//   preferences: {
//     language: 'English',
//     timezone: 'Eastern Time (ET)',
//     dateFormat: 'YYYY-MM-DD',
//     autoRefresh: true,
//     compactView: false,
//   },
// }

// const UserProfile = () => {
//   const { user, profile, updateProfile, logout, getDisplayName } = useAuth()
//   const [form, setForm] = useState(DEFAULTS)
//   const [savedMsg, setSavedMsg] = useState('')
//   const [errorMsg, setErrorMsg] = useState('')

//   const merged = useMemo(() => {
//     return { ...DEFAULTS, ...(profile || {}) }
//   }, [profile])

//   useEffect(() => {
//     setForm(merged)
//   }, [merged])

//   const onChange = (key) => (e) => {
//     const value = e.target.value
//     setForm((p) => ({ ...p, [key]: value }))
//   }

//   const onNotifChange = (key) => (e) => {
//     const checked = e.target.checked
//     setForm((p) => ({
//       ...p,
//       notifications: { ...(p.notifications || {}), [key]: checked },
//     }))
//   }

//   const onPrefChange = (key) => (e) => {
//     const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
//     setForm((p) => ({
//       ...p,
//       preferences: { ...(p.preferences || {}), [key]: value },
//     }))
//   }

//   const buildAvatar = (fullName) => {
//     const parts = (fullName || '').trim().split(/\s+/).filter(Boolean)
//     if (parts.length === 0) return '👤'
//     const a = parts[0]?.[0] || ''
//     const b = parts[1]?.[0] || ''
//     return (a + b).toUpperCase() || '👤'
//   }

//   const handleSave = () => {
//     setSavedMsg('')
//     setErrorMsg('')

//     // validaciones simples
//     if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
//       setErrorMsg('Email inválido.')
//       return
//     }

//     const next = {
//       ...form,
//       avatar: buildAvatar(form.fullName),
//       // si quieres guardar metadatos:
//       updatedAt: new Date().toISOString(),
//     }

//     updateProfile(next)
//     setSavedMsg('Cambios guardados ✅')
//     setTimeout(() => setSavedMsg(''), 2500)
//   }

//   const lastLoginLabel = user?.lastLogin
//     ? user.lastLogin
//     : 'Actual session (Service Layer)'

//   return (
//     <div className="page user-profile-page">
//       <div className="content-header">
//         <h1>User Profile</h1>
//         <p>Manage your account settings and preferences</p>
//       </div>

//       <div className="user-profile">
//         <div className="profile-header">
//           <div className="profile-avatar">{form.avatar || buildAvatar(form.fullName) || '👤'}</div>
//           <div className="profile-info">
//             <h2>{getDisplayName()}</h2>
//             <p>
//               {(form.jobTitle || 'Role')} • {(form.department || 'Department')}
//             </p>
//             <p>Last login: {lastLoginLabel}</p>
//           </div>
//         </div>

//         {errorMsg && <div className="banner error">{errorMsg}</div>}
//         {savedMsg && <div className="banner success">{savedMsg}</div>}

//         <div className="profile-content">
//           {/* LEFT COLUMN */}
//           <div>
//             <div className="profile-section">
//               <h3>Personal Information</h3>

//               <div className="form-group">
//                 <label>Full Name</label>
//                 <input type="text" className="form-control" value={form.fullName} onChange={onChange('fullName')} />
//               </div>

//               <div className="form-group">
//                 <label>Email Address</label>
//                 <input type="email" className="form-control" value={form.email} onChange={onChange('email')} />
//               </div>

//               <div className="form-group">
//                 <label>Phone Number</label>
//                 <input type="tel" className="form-control" value={form.phone} onChange={onChange('phone')} />
//               </div>

//               <div className="form-group">
//                 <label>Department</label>
//                 <input type="text" className="form-control" value={form.department} onChange={onChange('department')} />
//               </div>

//               <div className="form-group">
//                 <label>Role / Job Title</label>
//                 <input type="text" className="form-control" value={form.jobTitle} onChange={onChange('jobTitle')} />
//               </div>

//               <div className="actions-row">
//                 <button className="btn btn-primary" onClick={handleSave}>
//                   Save Changes
//                 </button>
//               </div>

//               <div className="hint">
//                 <strong>Note:</strong> Your SAP username/password are managed by SAP Service Layer and cannot be changed here.
//               </div>
//             </div>

//             <div className="profile-section">
//               <h3>Notification Preferences</h3>

//               <label className="checkbox-group">
//                 <input type="checkbox" checked={!!form.notifications.email} onChange={onNotifChange('email')} />
//                 Email notifications
//               </label>

//               <label className="checkbox-group">
//                 <input type="checkbox" checked={!!form.notifications.sms} onChange={onNotifChange('sms')} />
//                 SMS alerts
//               </label>

//               <label className="checkbox-group">
//                 <input type="checkbox" checked={!!form.notifications.criticalOnly} onChange={onNotifChange('criticalOnly')} />
//                 Critical errors only
//               </label>

//               <label className="checkbox-group">
//                 <input type="checkbox" checked={!!form.notifications.dailySummary} onChange={onNotifChange('dailySummary')} />
//                 Daily summary reports
//               </label>

//               <label className="checkbox-group">
//                 <input type="checkbox" checked={!!form.notifications.weeklyPerformance} onChange={onNotifChange('weeklyPerformance')} />
//                 Weekly performance reports
//               </label>
//             </div>
//           </div>

//           {/* RIGHT COLUMN */}
//           <div>
//             <div className="profile-section">
//               <h3>Security</h3>

//               <div className="security-settings">
//                 <div className="security-item">
//                   <div className="security-info">
//                     <h4>Password</h4>
//                     <p>Managed by SAP (Service Layer)</p>
//                   </div>
//                   <button className="btn btn-outline btn-sm" disabled title="Not available yet">
//                     Change
//                   </button>
//                 </div>

//                 <div className="security-item">
//                   <div className="security-info">
//                     <h4>Two-Factor Authentication</h4>
//                     <p>Not implemented</p>
//                   </div>
//                   <button className="btn btn-outline btn-sm" disabled title="Not available yet">
//                     Manage
//                   </button>
//                 </div>

//                 <div className="security-item">
//                   <div className="security-info">
//                     <h4>Current Session</h4>
//                     <p>Logout will invalidate your Service Layer session</p>
//                   </div>
//                   <button className="btn btn-danger btn-sm" onClick={logout}>
//                     Logout
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <div className="profile-section">
//               <h3>System Preferences</h3>

//               <div className="form-group">
//                 <label>Language</label>
//                 <select className="form-control" value={form.preferences.language} onChange={onPrefChange('language')}>
//                   <option>English</option>
//                   <option>Spanish</option>
//                 </select>
//               </div>

//               <div className="form-group">
//                 <label>Timezone</label>
//                 <select className="form-control" value={form.preferences.timezone} onChange={onPrefChange('timezone')}>
//                   <option>Eastern Time (ET)</option>
//                   <option>Central Time (CT)</option>
//                   <option>Pacific Time (PT)</option>
//                 </select>
//               </div>

//               <div className="form-group">
//                 <label>Date Format</label>
//                 <select className="form-control" value={form.preferences.dateFormat} onChange={onPrefChange('dateFormat')}>
//                   <option>YYYY-MM-DD</option>
//                   <option>MM/DD/YYYY</option>
//                   <option>DD/MM/YYYY</option>
//                 </select>
//               </div>

//               <label className="checkbox-group">
//                 <input type="checkbox" checked={!!form.preferences.autoRefresh} onChange={onPrefChange('autoRefresh')} />
//                 Auto-refresh dashboard data
//               </label>

//               <label className="checkbox-group">
//                 <input type="checkbox" checked={!!form.preferences.compactView} onChange={onPrefChange('compactView')} />
//                 Compact table view
//               </label>

//               <div className="actions-row">
//                 <button className="btn btn-primary" onClick={handleSave}>
//                   Save Preferences
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default UserProfile


import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import '../../styles/user-profile.css'
import { deleteMyAvatar } from '../../api/userProfile'

const MAX_AVATAR_MB = 3
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']


function getInitials(name) {
  if (!name) return '👤'
  const parts = String(name).trim().split(/\s+/).slice(0, 2)
  const initials = parts.map(p => p[0]?.toUpperCase()).join('')
  return initials || '👤'
}

export default function UserProfile() {
  const {
    user,
    profile,
    profileLoading,
    hydrateProfile,
    updateProfile,
    // opcional si lo agregas en AuthContext
    getDisplayName,
  } = useAuth()

  const fileInputRef = useRef(null)

  const displayName = useMemo(() => {
    if (typeof getDisplayName === 'function') return getDisplayName()
    // fallback
  return profile?.profile?.fullName || profile?.sap?.fullName || user?.name || 'User'  
}, [getDisplayName, profile?.profile?.fullName, profile?.sap?.fullName, user?.name])

  const sapUser = user?.name || ''
  const companyDb = user?.companyDb || ''

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: '',
    jobTitle: '',
  })

  const [dirty, setDirty] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // Avatar state
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [avatarUploading, setAvatarUploading] = useState(false)

  // Load profile on mount (if logged in)
  useEffect(() => {
    let mounted = true
    async function run() {
      if (!user?.name || !user?.companyDb) return
      try {
        await hydrateProfile()
      } catch (e) {
        if (!mounted) return
        // no bloquea la pantalla
      }
    }
    console.log('UserProfile useEffect triggered, user:', user)
    run()
    return () => { mounted = false }
  }, [user?.name, user?.companyDb, hydrateProfile])

  // Sync form when profile arrives/changes
  useEffect(() => {
    console.log('Sync form with profile:', profile)
  //   if (!profile) return
  //   setForm({
  //     fullName: profile.fullName || '',
  //     email: profile.email || '',
  //     phone: profile.phone || '',
  //     department: profile.department || '',
  //     jobTitle: profile.jobTitle || '',
  //   })
  //   setDirty(false)
  // }, [profile])

    if (!profile || !profile.profile) return  // Verifica que profile y profile.profile existan
      setForm({
        fullName: profile.profile?.fullName || profile.sap?.fullName || '',  // ✅ Usa profile.profile.fullName
        email: profile.profile?.email || profile.sap?.email || '',
        phone: profile.profile?.phone || profile.sap?.phone || '',
        department: profile.profile?.department || profile.sap?.department || '',
        jobTitle: profile.profile?.jobTitle || profile.sap?.jobTitle || '',
      })
      setDirty(false)
    }, [profile])

  // Temporizador para limpiar saveMsg después de 3 segundos
  useEffect(() => {
    if (saveMsg) {
      const timer = setTimeout(() => setSaveMsg(''), 3000); // 3 segundos
      return () => clearTimeout(timer); // Limpia el timer si saveMsg cambia antes
    }
  }, [saveMsg]);  

  //const currentAvatar = avatarPreview || profile?.avatarUrl || null
  //const currentAvatar = avatarPreview || profile?.profile?.avatarUrl || null  
  const currentAvatar = avatarPreview || profile?.profile?.avatarUrl || null
  const initials = getInitials(displayName)

  function onChangeField(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setDirty(true)
    setSaveMsg('')
    setErrorMsg('')
  }

  async function onSave(e) {
    e?.preventDefault?.()
    setSaveMsg('')
    setErrorMsg('')

    try {
      // Basic validation (puedes endurecerlo luego)
      if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
        throw new Error('Email inválido')
      }

      await updateProfile({
        fullName: form.fullName?.trim() || '',
        email: form.email?.trim() || '',
        phone: form.phone?.trim() || '',
        department: form.department?.trim() || '',
        jobTitle: form.jobTitle?.trim() || '',
      })

      setDirty(false)
      setSaveMsg('Saved ✅')
    } catch (err) {
      setErrorMsg(err?.message || 'Error saving profile')
    }
  }

  function onPickAvatar() {
    console.log('onPickAvatar called, currentAvatar:', currentAvatar);
    console.log('fileInputRef.current:', fileInputRef.current);  // ✅ Agrega esto
    setErrorMsg('');
    setSaveMsg('');
    if (fileInputRef.current) {
      fileInputRef.current.click();  // ✅ Asegura que exista antes de click
    } else {
      console.error('fileInputRef is null');  // ✅ Log si el ref falla
    }
  }

  async function onAvatarSelected(e) {
    console.log('onAvatarSelected called, file:', e.target.files?.[0]);
    const file = e.target.files?.[0]
    if (!file) return

    setErrorMsg('')
    setSaveMsg('')

    // validate file type + size
    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrorMsg('Formato no soportado. Usa JPG, PNG o WEBP.')
      e.target.value = ''
      return
    }
    const mb = file.size / (1024 * 1024)
    if (mb > MAX_AVATAR_MB) {
      setErrorMsg(`La imagen es muy grande. Máximo ${MAX_AVATAR_MB}MB.`)
      e.target.value = ''
      return
    }

    // local preview
    const previewUrl = URL.createObjectURL(file)
    setAvatarPreview(previewUrl)

    // upload to backend
    setAvatarUploading(true)
    try {
      const fd = new FormData()
      fd.append('avatar', file)

      // NOTE: endpoint en tu backend
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3010'}/api/me/avatar`,
        {
          method: 'POST',
          body: fd,
          // Para identificar al usuario (mismo enfoque temporal de headers)
          headers: {
            'x-sap-user': sapUser,
            'x-company-db': companyDb,
          },
          credentials: 'include',
        }
      )

      const text = await res.text()
      let data = null
      try { data = text ? JSON.parse(text) : null } catch { data = text || null }

      if (!res.ok) {
        const msg =
          (data && data.error && data.error.message && data.error.message.value) ||
          (data && data.Message) ||
          (typeof data === 'string' ? data : null) ||
          `HTTP ${res.status}`
        throw new Error(msg)
      }

      // si backend devuelve avatarUrl, lo persistimos en el profile (por updateProfile o reload)
      if (data?.avatarUrl) {
        // persistir en profile sin tocar SAP
        await updateProfile({ avatarUrl: data.avatarUrl })
        await hydrateProfile()
        setSaveMsg('Avatar updated ✅')
      } else {
        // si todavía no devuelves avatarUrl, al menos no rompe.
        setSaveMsg('Avatar uploaded ✅')
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Error uploading avatar')
    } finally {
      setAvatarUploading(false)
      // reset input so same file can be selected again
      e.target.value = ''
    }
  }

  // async function onRemoveAvatar() {
  //   if (!confirm('Remove avatar?')) return; // ✅ Agrega confirmación
  //   setErrorMsg('');
  //   setSaveMsg('');
  //   try {
  //     await deleteMyAvatar({ name: sapUser, companyDb });
  //     await updateProfile({ avatarUrl: null });  // Actualiza el estado local
  //     setAvatarPreview(null);  // ✅ Resetea cualquier preview local
  //     await hydrateProfile();  // Recarga el perfil
  //     setSaveMsg('Avatar removed ✅');
  //     fileInputRef.current.value = '';  // ✅ Resetea el input de archivo
  //   } catch (err) {
  //     setErrorMsg(err?.message || 'Error removing avatar');
  //   }
  // }

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);  // ✅ Estado para mostrar el modal

  async function onRemoveAvatar() {
    setShowDeleteConfirm(true);  // ✅ Muestra el modal en lugar de confirm
  }

  // Nueva función para confirmar el borrado
  async function confirmDeleteAvatar() {
    setShowDeleteConfirm(false);  // Oculta el modal
    setErrorMsg('');
    setSaveMsg('');
    try {
      await deleteMyAvatar({ name: sapUser, companyDb });
      await updateProfile({ avatarUrl: null });
      setAvatarPreview(null);
      await hydrateProfile();
      setSaveMsg('Avatar removed ✅');
      fileInputRef.current.value = '';
    } catch (err) {
      setErrorMsg(err?.message || 'Error removing avatar');
    }
  }

  // Nueva función para cancelar
  function cancelDeleteAvatar() {
    setShowDeleteConfirm(false);  // Oculta el modal
  }

  const disabled = profileLoading || avatarUploading

  return (
    console.log('Rendering UserProfile, profile:', profile, 'form:', form),
    <div className="page user-profile-page">
      <div className="up-header">
        {/* <div className="up-title">
          <h2>User Profile</h2>
          <p>Manage your portal profile. SAP credentials are managed by SAP Business One.</p>
        </div> */}
        <div className="content-header">
          <h1>User Profile</h1>
          <p>Manage your portal profile. SAP credentials are managed by SAP Business One.</p>
        </div>

        <div className="up-actions">
          <button
            className="up-btn up-btn-secondary"
            type="button"
            onClick={() => {hydrateProfile(); setSaveMsg('Profile reloaded ✅'); setErrorMsg('')}}
            disabled={disabled}
            title="Reload profile"
          >
            Refresh
          </button>

          <button
            className="up-btn up-btn-primary"
            type="button"
            onClick={onSave}
            disabled={disabled || !dirty}
            title={!dirty ? 'No changes' : 'Save changes'}
          >
            {profileLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {(errorMsg || saveMsg) && (
        <div className={`up-banner ${errorMsg ? 'error' : 'ok'}`}>
          {errorMsg || saveMsg}
        </div>
      )}

      <div className="up-grid">
        {/* Left: Profile card */}
        <div className="up-card">
          <div className="up-card-header">
            <div className="up-avatar-wrap">
              <div className="up-avatar">
                {currentAvatar ? (
                  <img src={currentAvatar} alt="avatar" />
                ) : (
                  <span>{initials}</span>
                )}
              </div>

              {/* <div className="up-avatar-actions">
                <button
                  className="up-btn up-btn-secondary"
                  type="button"
                  onClick={onPickAvatar}
                  disabled={disabled}
                >
                  {avatarUploading ? 'Uploading...' : 'Upload photo'}
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={onAvatarSelected}
                  style={{ display: 'none' }}
                />

                <div className="up-hint">
                  JPG/PNG/WEBP • Max {MAX_AVATAR_MB}MB
                </div>
              </div> */}
              <div className="" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                <div className="up-avatar-actions" style={{ display: 'flex', flexDirection: 'row', gap: '8px', marginTop: '12px' }}>  
                  <button
                    className="up-btn up-btn-secondary"
                    type="button"
                    onClick={onPickAvatar}
                    disabled={disabled}
                  >
                    {avatarUploading ? 'Uploading...' : 'Upload photo'}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={onAvatarSelected}
                    style={{ display: 'none' }}
                  />
                  {currentAvatar && (
                    <button
                      className="up-btn up-btn-danger"
                      type="button"
                      onClick={onRemoveAvatar}
                      disabled={disabled}
                    >
                      Remove photo
                    </button>
                  )}
                </div>
                <div className="up-hint">
                  JPG/PNG/WEBP • Max {MAX_AVATAR_MB}MB
                </div>
              </div>
            </div>

            <div className="up-user-meta">
              <h3 className="up-name">{displayName}</h3>
              <div className="up-sub">
                <span className="up-pill">SAP User: {sapUser || '—'}</span>
                <span className="up-pill">Company: {companyDb || '—'}</span>
              </div>

              <div className="up-note">
                Your SAP username/password are managed by SAP Service Layer and cannot be changed here.
              </div>
            </div>
          </div>
        </div>

        {/* Right: Editable form */}
        <div className="up-card">
          <div className="up-section-title">
            <h3>Personal Information</h3>
            <p>This information is stored only in the portal (not in SAP).</p>
          </div>

          <form className="up-form" onSubmit={onSave}>
            <div className="up-row">
              <div className="up-field">
                <label>Full Name</label>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={onChangeField}
                  placeholder="Your full name"
                  disabled={disabled}
                />
              </div>

              <div className="up-field">
                <label>Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChangeField}
                  placeholder="name@company.com"
                  disabled={disabled}
                />
              </div>
            </div>

            <div className="up-row">
              <div className="up-field">
                <label>Phone Number</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={onChangeField}
                  placeholder="+1 555 123 4567"
                  disabled={disabled}
                />
              </div>

              <div className="up-field">
                <label>Department</label>
                <input
                  name="department"
                  value={form.department}
                  onChange={onChangeField}
                  placeholder="Finance"
                  disabled={disabled}
                />
              </div>
            </div>

            <div className="up-row">
              <div className="up-field">
                <label>Job Title</label>
                <input
                  name="jobTitle"
                  value={form.jobTitle}
                  onChange={onChangeField}
                  placeholder="Finance Manager"
                  disabled={disabled}
                />
              </div>

              <div className="up-field up-field-readonly">
                <label>SAP Login</label>
                <input value={sapUser} disabled />
              </div>
            </div>

            <div className="up-form-actions">
              <button
                className="up-btn up-btn-secondary"
                type="button"
                onClick={() => {
                  // reset to last saved profile
                  if (!profile) return
                  setForm({
                    fullName: profile.fullName || '',
                    email: profile.email || '',
                    phone: profile.phone || '',
                    department: profile.department || '',
                    jobTitle: profile.jobTitle || '',
                  })
                  setDirty(false)
                  setErrorMsg('')
                  setSaveMsg('')
                }}
                disabled={disabled || !dirty}
              >
                Discard
              </button>

              <button
                className="up-btn up-btn-primary"
                type="submit"
                disabled={disabled || !dirty}
              >
                {profileLoading ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* Modal de confirmación personalizado */}
      {showDeleteConfirm && (
        <div className="up-modal-overlay" onClick={cancelDeleteAvatar}>  {/* Overlay para cerrar al hacer clic fuera */}
          <div className="up-modal" onClick={(e) => e.stopPropagation()}>  {/* Evita cerrar al hacer clic dentro */}
            <h3>Remove Avatar</h3>
            <p>Are you sure you want to remove your avatar? This action cannot be undone.</p>
            <div className="up-modal-actions">
              <button className="up-btn up-btn-secondary" onClick={cancelDeleteAvatar}>
                Cancel
              </button>
              <button className="up-btn up-btn-danger" style={{
                  background: '#FF6B00',
                  color: 'white',
                }} onClick={confirmDeleteAvatar}>
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
