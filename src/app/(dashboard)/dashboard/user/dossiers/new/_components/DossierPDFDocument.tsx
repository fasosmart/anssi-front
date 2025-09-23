import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { DossierFormData } from '@/types/api';

// Register fonts
// Note: You might need to host these fonts locally in your /public folder
Font.register({
  family: 'Times-Roman',
  src: `https://fonts.gstatic.com/s/timesnewroman/v1/times-new-roman.ttf`,
});
Font.register({
  family: 'Times-Bold',
  src: `https://fonts.gstatic.com/s/timesnewroman/v1/times-new-roman-bold.ttf`,
  fontWeight: 'bold',
});


// Create styles
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Times-Roman',
    fontSize: 10,
    padding: 40,
    backgroundColor: '#fff',
    color: '#000',
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
  h1: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  h2: {
    fontSize: 12,
    marginTop: 2
  },
  h3: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    border: '2px solid #002060',
    padding: 5,
    alignSelf: 'center',
    backgroundColor: '#002060',
    color: '#fff',
    width: "100%",
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 11,
    backgroundColor: '#002060', // gray background
    color: '#000', // black text
    padding: 5,
    marginTop: 15,
    marginBottom: 5,
    border: '1.5px solid #000',
  },
  instructionText: {
    fontSize: 8,
    fontStyle: 'italic',
    color: '#555',
    marginTop: 5,
    paddingHorizontal: 10,
  },
  subHeader: {
    fontWeight: 'bold',
    fontSize: 11,
    marginTop: 8,
    marginBottom: 4,
    textDecoration: 'underline',
  },
  fieldContainer: {
    display: 'flex',
    flexDirection: 'row',
    borderBottom: '1px solid #ccc',
    paddingVertical: 3,
    alignItems: 'flex-end'
  },
  fieldLabel: {
    color: '#555',
  },
  fieldValue: {
    flex: 1,
    textAlign: 'left',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  fieldsGroup: {
    paddingLeft: 15,
  },
  grid: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gridItem: {
    flexBasis: '48%',
  },
  gridItemThird: {
    flexBasis: '32%',
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: '#000',
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
  },
  tableHeader: {
    backgroundColor: '#002060',
    color: '#fff',
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: '#000',
  },
  tableCol20: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: '#000',
  },
  tableCell: {
    padding: 5,
    fontWeight: 'bold'
  },
  tableCellHeader: {
    padding: 5,
    fontWeight: 'bold',
    color: '#fff'
  },
  engagementSection: {
    marginTop: 20,
    fontSize: 9,
  },
  signatureSection: {
    marginTop: 40,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20
  },
  pageBreak: {
    marginTop: 20,
  }
});

const FormField = ({ label, value }: { label: string, value?: string | number | null }) => (
    <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>- {label}:</Text>
        <Text style={styles.fieldValue}>{value || '.........................'}</Text>
    </View>
);

// Create Document Component
export const DossierPDFDocument: React.FC<{ data: Partial<DossierFormData> }> = ({ data }) => {
    const { companyInfo, legalRepresentative, representativeDiplomas, representativeCertifications, representativeExperience, accreditationTypes } = data;
    
    const accreditationMap: Record<string, string> = {
        apacs: "APACS - Accompagnement et Conseil en sécurité",
        apassi: "APASSI - Audit de la Sécurité des Systèmes d’Information",
        apdis: "APDIS - Détection d’Incidents de Sécurité",
        apris: "APRIS - Réponse aux Incidents de Sécurité",
        apin: "APIN - Investigation Numérique",
    };

    const selectedAccreditations = accreditationTypes
    ? Object.entries(accreditationTypes)
        .filter(([, isSelected]) => isSelected)
        .map(([key]) => accreditationMap[key])
    : [];
    
    return (
        <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.h1}>Demande d&apos;accréditation dans le domaine de la cyber sécurité</Text>
                <Text style={styles.h2}>- Personne Morale -</Text>
                <Text style={styles.h3}>Fiche de renseignements</Text>
            </View>

            <Text style={styles.sectionTitle}>Renseignements généraux</Text>

            <Text style={styles.subHeader}>Identité de la société</Text>
            <View style={styles.fieldsGroup}>
              <View style={styles.grid}>
                  <View style={styles.gridItem}><FormField label="Nom" value={companyInfo?.name} /></View>
                  <View style={styles.gridItem}><FormField label="Sigle" value={companyInfo?.acronym} /></View>
              </View>
              <FormField label="Secteur d'activité" value={companyInfo?.business_sector} />
              <FormField label="Identifiant fiscal N°" value={companyInfo?.tax_id} />
              <FormField label="Registre du commerce" value={companyInfo?.commercial_register} />
              <View style={styles.grid}>
                  <View style={styles.gridItem}><FormField label="Nombre du personnel" value={companyInfo?.total_staff} /></View>
                  <View style={styles.gridItem}><FormField label="Dont... Experts en sécurité informatique" value={companyInfo?.cybersecurity_experts} /></View>
              </View>
            </View>

            <Text style={styles.subHeader}>Identité du représentant juridique</Text>
            <View style={styles.fieldsGroup}>
              <View style={styles.grid}>
                  <View style={styles.gridItem}><FormField label="Nom et Prénom" value={`${legalRepresentative?.first_name} ${legalRepresentative?.last_name}`} /></View>
                  <View style={styles.gridItem}><FormField label="Nationalité" value={"Non renseigné"} /></View>
              </View>
              <FormField label="Fonction" value={legalRepresentative?.job_title} />
              <View style={styles.grid}>
                  <View style={styles.gridItemThird}><FormField label="Pièce d'identité N°" value={legalRepresentative?.idcard_number} /></View>
                  <View style={styles.gridItemThird}><FormField label="délivrée le" value={legalRepresentative?.idcard_issued_at} /></View>
                  <View style={styles.gridItemThird}><FormField label="expire le" value={legalRepresentative?.idcard_expires_at} /></View>
              </View>
              <FormField label="Adresse" value={"Non renseigné"} />
              <View style={styles.grid}>
                  <View style={styles.gridItem}><FormField label="Tél" value={legalRepresentative?.phone} /></View>
                  <View style={styles.gridItem}><FormField label="Tél. Portable" value={legalRepresentative?.mobile} /></View>
              </View>
              <FormField label="E-mail" value={legalRepresentative?.email} />
            </View>

            <Text style={styles.subHeader}>Coordonnées de la société</Text>
            <View style={styles.fieldsGroup}>
              <FormField label="Adresse" value={companyInfo?.address} />
              <View style={styles.grid}>
                  <View style={styles.gridItem}><FormField label="Tél" value={companyInfo?.phone} /></View>
                  <View style={styles.gridItem}><FormField label="Tél. Portable" value={companyInfo?.mobile} /></View>
              </View>
              <View style={styles.grid}>
                <View style={styles.gridItem}><FormField label="E-mail" value={companyInfo?.email} /></View>
                <View style={styles.gridItem}><FormField label="Site Web" value={companyInfo?.website} /></View>
              </View>
            </View>
            <Text style={styles.instructionText}>
                [
                  Joindre une copie de la Pièce d’Identité, le bulletin N°3 datant de moins de 3 mois, une copie de l'extrait
                  du registre national des entreprises, le statut accompagné d’un justificatif de son publication au Journal
                  Officiel de la République Guinéenne ou au Journal Officiel du Registre National des Entreprises, un certificat
                  de non faillite, l’attestation d’affiliation à la CNSS, la dernière déclaration des salaires et des salariés.
                ]
            </Text>
            
            <Text style={styles.sectionTitle}>2. Diplômes du Représentant juridique</Text>
            <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                    <View style={[styles.tableCol, {width: '30%'}]}><Text style={styles.tableCellHeader}>Diplôme</Text></View>
                    <View style={[styles.tableCol, {width: '30%'}]}><Text style={styles.tableCellHeader}>Institution</Text></View>
                    <View style={[styles.tableCol, {width: '20%'}]}><Text style={styles.tableCellHeader}>Spécialité / Année</Text></View>
                    <View style={[styles.tableCol, {width: '20%'}]}><Text style={styles.tableCellHeader}>Références*</Text></View>
                </View>
                {(representativeDiplomas || []).map((d, i) => (
                    <View key={i} style={styles.tableRow}>
                        <View style={[styles.tableCol, {width: '30%'}]}><Text style={styles.tableCell}>{d.degree_name}</Text></View>
                        <View style={[styles.tableCol, {width: '30%'}]}><Text style={styles.tableCell}>{d.institution}</Text></View>
                        <View style={[styles.tableCol, {width: '20%'}]}><Text style={styles.tableCell}>{d.year_obtained}</Text></View>
                        <View style={[styles.tableCol, {width: '20%'}]}><Text style={styles.tableCell}>{d.file ? 'Fichier joint' : 'N/A'}</Text></View>
                    </View>
                ))}
            </View>
            <Text style={styles.instructionText}>
                [Joindre les diplômes universitaires et indiquer la référence du dossier renfermant ces pièces justificatives dans la colonne appropriée]
            </Text>

            <Text style={styles.sectionTitle}>3. Cycles de formations du Représentant juridique</Text>
            <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                    <View style={[styles.tableCol, {width: '30%'}]}><Text style={styles.tableCellHeader}>Formation / Certification</Text></View>
                        <View style={[styles.tableCol, {width: '30%'}]}><Text style={styles.tableCellHeader}>Institut / Organisme</Text></View>
                        <View style={[styles.tableCol, {width: '20%'}]}><Text style={styles.tableCellHeader}>Promotion / Année</Text></View>
                        <View style={[styles.tableCol, {width: '20%'}]}><Text style={styles.tableCellHeader}>Références*</Text></View>
                    </View>
                    {(representativeCertifications || []).map((t, i) => (
                        <View key={i} style={styles.tableRow}>
                            <View style={[styles.tableCol, {width: '30%'}]}><Text style={styles.tableCell}>{t.training_name}</Text></View>
                            <View style={[styles.tableCol, {width: '30%'}]}><Text style={styles.tableCell}>{t.institution}</Text></View>
                            <View style={[styles.tableCol, {width: '20%'}]}><Text style={styles.tableCell}>{t.year_obtained}</Text></View>
                            <View style={[styles.tableCol, {width: '20%'}]}><Text style={styles.tableCell}>{t.file ? 'Fichier joint' : 'N/A'}</Text></View>
                        </View>
                    ))}
                </View>
                <Text style={styles.instructionText}>
                    [Joindre l’attestation de réussite ou le certificat pour chaque cycle de formation mentionné dans le tableau ci-dessus et indiquer la référence du dossier renfermant ces pièces justificatives dans la colonne appropriée]
                </Text>

                <Text style={styles.sectionTitle}>4. Cursus professionnel du Représentant juridique</Text>
                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <View style={styles.tableCol20}><Text style={styles.tableCellHeader}>Organisme</Text></View>
                        <View style={styles.tableCol20}><Text style={styles.tableCellHeader}>Forme de recrutement</Text></View>
                        <View style={styles.tableCol20}><Text style={styles.tableCellHeader}>Fonctions Exercées</Text></View>
                        <View style={styles.tableCol20}><Text style={styles.tableCellHeader}>Durée Du Au</Text></View>
                        <View style={styles.tableCol20}><Text style={styles.tableCellHeader}>Pièces justificatives*</Text></View>
                </View>
                {(representativeExperience || []).map((e, i) => (
                     <View key={i} style={styles.tableRow}>
                        <View style={styles.tableCol20}><Text style={styles.tableCell}>{e.company}</Text></View>
                        <View style={styles.tableCol20}><Text style={styles.tableCell}>Non renseigné</Text></View>
                        <View style={styles.tableCol20}><Text style={styles.tableCell}>{e.job_title}</Text></View>
                        <View style={styles.tableCol20}><Text style={styles.tableCell}>{`${e.start_date} - ${e.end_date || 'Présent'}`}</Text></View>
                        <View style={styles.tableCol20}><Text style={styles.tableCell}>N/A</Text></View>
                    </View>
                ))}
            </View>
            <Text style={styles.instructionText}>
                [Joindre l'attestation de travail ainsi pièces justificatives de chaque expérience professionnelle mentionnée dans le tableau ci-dessus et indiquer la référence du dossier renfermant ces pièces justificatives dans la colonne appropriée]
            </Text>

            <Text style={styles.sectionTitle}>Préciser l&apos;accréditation sollicitée</Text>
            <View style={{ border: '1px solid black', padding: 10, marginTop: 5 }}>
                {selectedAccreditations.length > 0 ? 
                    selectedAccreditations.map((acc, i) => <Text key={i}>- {acc}</Text>) :
                    <Text>Aucune accréditation sélectionnée</Text>
                }
            </View>

            <Text style={styles.sectionTitle}>Engagement et déclaration sur l&apos;honneur</Text>
            <View style={styles.engagementSection}>
                <Text>Je soussigné,</Text>
                <Text>- m&apos;engage à respecter les dispositions du cahier des charges, et j&apos;assume mes responsabilités face à toute infraction;</Text>
                <Text>- désigne mon correspondant déclaré à l&apos;unique à l&apos;ANSI Guinée pour traiter mes données à caractère;</Text>
                <Text>- déclare sur l&apos;honneur l&apos;exactitude des renseignements contenus dans la présente fiche;</Text>
                <Text>- m&apos;engage à informer l&apos;ANSI Guinée de chaque modification qui survient sur les données déclarées.</Text>
            </View>
            
            <View style={styles.signatureSection}>
                <Text style={{fontWeight: 'bold'}}>Signature et cachet</Text>
                <Text>................., le ..... / ..... / 20.....</Text>
            </View>
        </Page>
        </Document>
    );
};