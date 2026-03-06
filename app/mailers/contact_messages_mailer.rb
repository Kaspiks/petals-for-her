# frozen_string_literal: true

class ContactMessagesMailer < ActionMailer::Base
  default from: "noreply@petalsforher.com"

  def notify(contact_message)
    @contact_message = contact_message

    mail(
      to: "info@petalsforher.com",
      reply_to: contact_message.email,
      subject: "[Petals for Her] Contact Message from #{contact_message.name}"
    )
  end
end
