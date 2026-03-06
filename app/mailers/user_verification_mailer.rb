# frozen_string_literal: true

class UserVerificationMailer < ActionMailer::Base
  default from: ENV.fetch("MAIL_FROM", "noreply@petalsforher.com")

  def verification_code(user)
    @user = user
    @verification_code = user.verification_code
    @verify_url = verify_account_url

    roses_path = Rails.root.join("frontend", "dist", "roses.png")
    if File.exist?(roses_path)
      attachments.inline["roses.png"] = File.read(roses_path)
      @email_banner_url = attachments["roses.png"].url
    else
      @email_banner_url = nil
    end

    mail(
      to: user.email,
      subject: "Verify your email – Petals for Her"
    )
  end

  private

  def verify_account_url
    opts = Rails.application.config.action_mailer.default_url_options
    base_host = opts[:host] || "localhost"
    protocol = opts[:protocol] || "http"
    if Rails.env.production? && protocol == "https"
      "#{protocol}://#{base_host}/verify?email=#{ERB::Util.url_encode(@user.email)}"
    else
      base_port = opts[:port]
      frontend_port = base_port == 3000 ? 5173 : (base_port || 80)
      "#{protocol}://#{base_host}:#{frontend_port}/verify?email=#{ERB::Util.url_encode(@user.email)}"
    end
  end
end
