import React from 'react';
import Modal from '../common/Modal';
import PrivacyPolicyContent from './PrivacyPolicyContent';
import TermsOfServiceContent from './TermsOfServiceContent';
import CookiePolicyContent from './CookiePolicyContent';

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