import React from 'react';
import Modal from './Modal';
import PrivacyPolicyContent from './policy-contents/PrivacyPolicyContent';
import TermsOfServiceContent from './policy-contents/TermsOfServiceContent';
import CookiePolicyContent from './policy-contents/CookiePolicyContent';

export type PolicyType = 'privacy' | 'terms' | 'cookies' | null;

interface PolicyModalsProps {
  activePolicy: PolicyType;
  onClose: () => void;
}

const PolicyModals: React.FC<PolicyModalsProps> = ({ activePolicy, onClose }) => {
  return (
    <>
      <Modal 
        isOpen={activePolicy === 'privacy'} 
        onClose={onClose}
        title="Privacy Policy"
      >
        <PrivacyPolicyContent />
      </Modal>

      <Modal 
        isOpen={activePolicy === 'terms'} 
        onClose={onClose}
        title="Terms of Service"
      >
        <TermsOfServiceContent />
      </Modal>

      <Modal 
        isOpen={activePolicy === 'cookies'} 
        onClose={onClose}
        title="Cookie Policy"
      >
        <CookiePolicyContent />
      </Modal>
    </>
  );
};

export default PolicyModals;