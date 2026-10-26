import React, { useState, useEffect } from 'react';
import { useDevotee } from '../../context/DevoteeContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';

export const ProfileView: React.FC = () => {
  const { profile, updateProfile, addFamilyMember, deleteFamilyMember } = useDevotee();
  const { loc } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...profile });
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRelation, setNewMemberRelation] = useState('');
  const [newMemberNakshatra, setNewMemberNakshatra] = useState('');

  useEffect(() => {
    setFormData({ ...profile });
  }, [profile]);

  const handleDeleteMember = async (idx: number) => {
    const member = formData.familyMembers[idx];
    if (member?.id) {
      await deleteFamilyMember(member.id);
    } else {
      const updated = formData.familyMembers.filter((_, i) => i !== idx);
      setFormData((p) => ({ ...p, familyMembers: updated }));
    }
  };

  const displayDevoteeName =
    profile.name?.trim() ||
    loc('Registered Yajamana', 'नोंदणीकृत यजमान', 'पंजीकृत यजमान', 'નોંધાયેલ યજમાન');

  const displayKuladaivat =
    profile.kuladaivat?.trim() ||
    loc(
      'Shree Kulaswamini Tuljabhavani & Khanderaya',
      'श्री कुलस्वामिनी तुळजाभवानी व खंडेराय',
      'श्री कुलस्वामिनी तुलजाभवानी एवं खंडेराय',
      'શ્રી કુલસ્વામિની તુળજાભવાની અને ખંડેરાય'
    );

  const initials = displayDevoteeName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || 'CV';

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(formData);
    setIsEditing(false);
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    await addFamilyMember({
      name: newMemberName.trim(),
      relation: newMemberRelation.trim() || loc('Family Member', 'कुटुंब सदस्य', 'परिवार सदस्य', 'પરિવાર સભ્ય'),
      nakshatra: newMemberNakshatra.trim() || loc('Rohini', 'रोहिणी', 'रोहिणी', 'રોહિણી'),
    });
    setNewMemberName('');
    setNewMemberRelation('');
    setNewMemberNakshatra('');
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#570013] font-bold">
            {loc(
              'My Devotee Profile & Gotra Lineage',
              'माझे प्रोफाईल व गोत्र तपशील',
              'मेरी प्रोफाइल एवं गोत्र विवरण',
              'મારી પ્રોફાઇલ અને ગોત્ર વિગત'
            )}
          </h1>
          <p className="text-xs sm:text-sm text-[#584141]">
            {loc(
              'Official Gotra and family details utilized for Vedic Sankalpa, Havans, and horoscopy.',
              'यज्ञ संकल्प, पूजा व ज्योतिषीय संदर्भासाठी आपले अधिकृत गोत्र व कौटुंबिक तपशील.',
              'यज्ञ संकल्प, पूजा एवं ज्योतिषीय संदर्भ हेतु आपका अधिकृत गोत्र एवं पारिवारिक विवरण।',
              'યજ્ઞ સંકલ્પ, પૂજા અને જ્યોતિષીય સંદર્ભ માટે આપનું અધિકૃત ગોત્ર અને પારિવારિક વિગત.'
            )}
          </p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 rounded-xl bg-[#570013] text-white text-xs font-bold hover:bg-[#800020] transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">
            {isEditing ? 'close' : 'edit'}
          </span>
          <span>
            {isEditing
              ? loc('Cancel', 'रद्द करा', 'रद्द करें', 'રદ કરો')
              : loc('Edit Profile', 'माहिती संपादित करा', 'प्रोफाइल संपादित करें', 'પ્રોફાઇલ સંપાદિત કરો')}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Details Form (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 lg:p-8 shadow-xs border border-[#E0BFBF]/40 space-y-6">
          <div className="flex items-center gap-4 pb-4 border-b border-[#E0BFBF]/30">
            <div className="w-16 h-16 rounded-full bg-[#FFD979] text-[#795D00] flex items-center justify-center font-bold font-serif text-2xl shadow-xs">
              {initials}
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-[#570013]">
                {displayDevoteeName}
              </h2>
              <span className="text-xs text-[#765B00] font-mono font-bold block">
                {loc('Authorized Devotee ID:', 'अधिकृत भक्त संकेतांक:', 'अधिकृत भक्त कोड:', 'અધિકૃત ભક્ત કોડ:')}{' '}
                {profile.code || '#CVP-DEVOTEE'}
              </span>
              <span className="text-xs text-[#584141]">{displayKuladaivat}</span>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-[#584141] block">
                  {loc('Devotee / Yajamana Name', 'यजमान नाव', 'यजमान नाम', 'યજમાન નામ')}
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#FFF8F6] px-3 py-2 rounded-lg border border-[#E0BFBF]/40 text-sm text-[#221918] disabled:opacity-75 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-[#584141] block">
                  {loc('Gotra & Pravara', 'गोत्र व प्रवर', 'गोत्र एवं प्रवर', 'ગોત્ર અને પ્રવર')}
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.gotra}
                  onChange={(e) => setFormData({ ...formData, gotra: e.target.value })}
                  className="w-full bg-[#FFF8F6] px-3 py-2 rounded-lg border border-[#E0BFBF]/40 text-sm text-[#221918] disabled:opacity-75 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-[#584141] block">
                  {loc('Birth Nakshatra & Pada', 'जन्म नक्षत्र व चरण', 'जन्म नक्षत्र एवं चरण', 'જન્મ નક્ષત્ર અને ચરણ')}
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.nakshatra}
                  onChange={(e) => setFormData({ ...formData, nakshatra: e.target.value })}
                  className="w-full bg-[#FFF8F6] px-3 py-2 rounded-lg border border-[#E0BFBF]/40 text-sm text-[#221918] disabled:opacity-75 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-[#584141] block">
                  {loc('Moon Sign (Rashi)', 'चंद्र रास', 'चंद्र राशि', 'ચંદ્ર રાશિ')}
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.rashi}
                  onChange={(e) => setFormData({ ...formData, rashi: e.target.value })}
                  className="w-full bg-[#FFF8F6] px-3 py-2 rounded-lg border border-[#E0BFBF]/40 text-sm text-[#221918] disabled:opacity-75 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-[#584141] block">
                  {loc('Mobile Number', 'भ्रमणध्वनी', 'मोबाइल नंबर', 'મોબાઇલ નંબર')}
                </label>
                <input
                  type="tel"
                  disabled
                  value={formData.phone}
                  className="w-full bg-[#FFF8F6] px-3 py-2 rounded-lg border border-[#E0BFBF]/40 text-sm text-[#221918] opacity-75 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-[#584141] block">
                  {loc('Email Address', 'ईमेल पत्ता', 'ईमेल पता', 'ઈમેલ સરનામું')}
                </label>
                <input
                  type="email"
                  disabled={!isEditing}
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#FFF8F6] px-3 py-2 rounded-lg border border-[#E0BFBF]/40 text-sm text-[#221918] disabled:opacity-75 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-[#584141] block">
                  {loc('Kuladaivat / Ishta Devata', 'कुलदैवत / इष्ट देवता', 'कुलदैवत / इष्ट देवता', 'કુળદૈવત / ઇષ્ટ દેવતા')}
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.kuladaivat || ''}
                  onChange={(e) => setFormData({ ...formData, kuladaivat: e.target.value })}
                  className="w-full bg-[#FFF8F6] px-3 py-2 rounded-lg border border-[#E0BFBF]/40 text-sm text-[#221918] disabled:opacity-75 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-[#584141] block">
                  {loc('PAN Number (For 80G Form 10BE)', 'पॅन क्रमांक (80G करसवलत)', 'पैन नंबर (80G कर छूट)', 'પાન નંબર (80G કરમુક્તિ)')}
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  placeholder="ABCDE1234F"
                  value={formData.panNumber || ''}
                  onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                  className="w-full bg-[#FFF8F6] px-3 py-2 rounded-lg border border-[#E0BFBF]/40 text-sm font-mono text-[#221918] disabled:opacity-75 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-[#584141] block">
                  {loc('Date of Birth', 'जन्म तारीख', 'जन्म तिथि', 'જન્મ તારીખ')}
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  placeholder="YYYY-MM-DD"
                  value={formData.dob || ''}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full bg-[#FFF8F6] px-3 py-2 rounded-lg border border-[#E0BFBF]/40 text-sm text-[#221918] disabled:opacity-75 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-[#584141] block">
                  {loc('Birth Time & Place', 'जन्म वेळ व ठिकाण', 'जन्म समय एवं स्थान', 'જન્મ સમય અને સ્થળ')}
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  placeholder="06:42 AM • Pune"
                  value={formData.tob || ''}
                  onChange={(e) => setFormData({ ...formData, tob: e.target.value })}
                  className="w-full bg-[#FFF8F6] px-3 py-2 rounded-lg border border-[#E0BFBF]/40 text-sm text-[#221918] disabled:opacity-75 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-[11px] font-bold uppercase text-[#584141] block">
                  {loc(
                    'Residential Address (For Sacred Prasad Delivery)',
                    'निवास पत्ता (प्रसाद टपाल वितरणासाठी)',
                    'निवास का पता (प्रसाद डाक वितरण हेतु)',
                    'રહેઠાણનું સરનામું (પ્રસાદ ટપાલ વિતરણ માટે)'
                  )}
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-[#FFF8F6] px-3 py-2 rounded-lg border border-[#E0BFBF]/40 text-sm text-[#221918] disabled:opacity-75 focus:outline-none"
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-[#570013] text-white text-xs font-bold hover:bg-[#800020] shadow-xs cursor-pointer"
                >
                  {loc('Save Changes', 'बदल जतन करा', 'परिवर्तन सहेजें', 'ફેરફારો સાચવો')}
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Right (4 cols): Family members for Sankalpa */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 shadow-xs border border-[#E0BFBF]/40 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E0BFBF]/30">
            <h3 className="font-serif text-base font-bold text-[#570013]">
              {loc('Sankalpa Family Members', 'कुटुंब सदस्य (संकल्प)', 'परिवार के सदस्य (संकल्प)', 'પરિવારના સભ્યો (સંકલ્પ)')}
            </h3>
            <span className="material-symbols-outlined text-[#765B00] text-xl">family_restroom</span>
          </div>
          <p className="text-xs text-[#584141]">
            {loc(
              'These family members are named during every Vedic Sankalpa, Havan, and Anushthan.',
              'प्रत्येक अनुष्ठान व होमामध्ये या सदस्यांचा नामोच्चार व संकल्प केला जातो.',
              'प्रत्येक अनुष्ठान एवं हवन में इन सदस्यों का नामोच्चार एवं संकल्प किया जाता है।',
              'દરેક અનુષ્ઠાન અને હવનમાં આ સભ્યોનું નામોચ્ચાર અને સંકલ્પ કરવામાં આવે છે.'
            )}
          </p>

          <div className="space-y-2 text-xs">
            {formData.familyMembers.length === 0 ? (
              <div className="p-4 rounded-lg bg-[#FFF0ED] text-center text-[#8C7071] text-xs">
                {loc(
                  'No family members added yet. Add family members below for Sankalpa.',
                  'कोणतेही कुटुंब सदस्य जोडलेले नाहीत. संकल्पासाठी खाली सदस्य जोडा.',
                  'अभी तक कोई परिवार सदस्य नहीं जोड़ा गया है। नीचे सदस्य जोड़ें।',
                  'હજુ સુધી કોઈ પરિવારના સભ્ય ઉમેરાયા નથી. નીચે સભ્ય ઉમેરો.'
                )}
              </div>
            ) : (
              formData.familyMembers.map((m, idx) => (
                <div
                  key={m.id || idx}
                  className="p-3 rounded-lg bg-[#FFF0ED] border border-[#E0BFBF]/30 flex items-center justify-between gap-2"
                >
                  <div className="flex flex-col space-y-0.5">
                    <span className="font-bold text-[#221918]">{m.name}</span>
                    <span className="text-[11px] text-[#584141]">
                      {m.relation} • {loc('Nakshatra:', 'नक्षत्र:', 'नक्षत्र:', 'નક્ષત્ર:')} {m.nakshatra}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteMember(idx)}
                    className="text-[#8C7071] hover:text-[#570013] p-1 cursor-pointer transition-colors"
                    title={loc('Remove', 'काढून टाका', 'हटाएं', 'દૂર કરો')}
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Add Member inline form */}
          <form onSubmit={handleAddMember} className="pt-3 border-t border-[#E0BFBF]/30 space-y-2 text-xs">
            <span className="font-bold text-[#570013] block">
              {loc('+ Add New Member', '+ नवीन सदस्य जोडा', '+ नया सदस्य जोड़ें', '+ નવો સભ્ય ઉમેરો')}
            </span>
            <input
              type="text"
              placeholder={loc('Full Name', 'नाव', 'नाम', 'પૂરું નામ')}
              required
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              className="w-full bg-[#FFF8F6] p-2 rounded border border-[#E0BFBF]/40"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder={loc('Relation (e.g. Daughter)', 'नाते (उदा. कन्या)', 'संबंध (उदा. पुत्री)', 'સંબંધ (દા.ત. પુત્રી)')}
                required
                value={newMemberRelation}
                onChange={(e) => setNewMemberRelation(e.target.value)}
                className="bg-[#FFF8F6] p-2 rounded border border-[#E0BFBF]/40"
              />
              <input
                type="text"
                placeholder={loc('Nakshatra', 'नक्षत्र', 'नक्षत्र', 'નક્ષત્ર')}
                required
                value={newMemberNakshatra}
                onChange={(e) => setNewMemberNakshatra(e.target.value)}
                className="bg-[#FFF8F6] p-2 rounded border border-[#E0BFBF]/40"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 rounded bg-[#765B00] text-white font-bold hover:opacity-90 transition-opacity cursor-pointer mt-1"
            >
              {loc('Add Member', 'सदस्य जोडा', 'सदस्य जोड़ें', 'સભ્ય ઉમેરો')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
