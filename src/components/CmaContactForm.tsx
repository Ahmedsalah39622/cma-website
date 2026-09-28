'use client';

import { useState, type FormEvent } from 'react';
import { ArrowUpRight, Check, LoaderCircle } from 'lucide-react';
import { submitContact } from '@/actions/contact';

export default function CmaContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('sending');
    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      await submitContact({
        name: String(formData.get('name') || ''),
        email: String(formData.get('email') || ''),
        website: String(formData.get('website') || ''),
        message: String(formData.get('message') || ''),
      });
      form.reset();
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  return (
    <form className="cma-contact-form" onSubmit={handleSubmit}>
      <label>
        <span>Your name</span>
        <input name="name" autoComplete="name" placeholder="Jane Smith" required />
      </label>
      <label>
        <span>Work email</span>
        <input name="email" type="email" autoComplete="email" placeholder="jane@company.com" required />
      </label>
      <label>
        <span>Website <em>Optional</em></span>
        <input name="website" type="url" placeholder="https://" />
      </label>
      <label>
        <span>What are you looking to build?</span>
        <textarea name="message" rows={3} placeholder="A little about your goals, timeline, or big idea..." />
      </label>
      <div className="cma-form-footer">
        <button type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? <LoaderCircle className="cma-spinner" size={17} /> : status === 'sent' ? <Check size={17} /> : <ArrowUpRight size={17} />}
          {status === 'sending' ? 'Sending...' : status === 'sent' ? 'Message sent' : 'Send your enquiry'}
        </button>
        <span aria-live="polite" className={status === 'error' ? 'cma-form-error' : 'cma-form-note'}>
          {status === 'error' ? 'Something went wrong. Please try again.' : status === 'sent' ? 'Thanks. We\'ll be in touch shortly.' : 'No pressure. Just a good conversation.'}
        </span>
      </div>
    </form>
  );
}
