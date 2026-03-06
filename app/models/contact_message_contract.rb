# frozen_string_literal: true

class ContactMessageContract < Dry::Validation::Contract
  params do
    required(:contact_message).hash do
      required(:name).filled(:string, max_size?: 255)
      required(:email).filled(:string, max_size?: 255)
      required(:subject).value(:string, max_size?: 255)
      required(:message).filled(:string, max_size?: 4000)
    end
  end

  rule(contact_message: :email) do
    key.failure("has invalid format") unless URI::MailTo::EMAIL_REGEXP.match?(value.to_s)
  end
end
