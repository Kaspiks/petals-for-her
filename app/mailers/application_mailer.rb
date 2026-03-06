# frozen_string_literal: true

class ApplicationMailer < ActionMailer::Base
  include InstanceCache

  def send_email_using_template(template_code, mail_options:, placeholders:)
    template = email_template(template_code)

    return if skip_template_email?(template)

    options = mail_options.merge(subject: template.subject)

    mail(options) do |format|
      format.html { render body: html_body_from_template(template, placeholders: placeholders) }
      format.text { render body: text_body_from_template(template, placeholders: placeholders) }
    end
  end

  def skip_template_email?(template)
    template = email_template(template) if template.is_a?(String)

    !template.send_email?
  end

  private

  def email_template(code)
    instance_cache_fetch("template_#{code}") do
      EmailTemplate.find_by!(code:)
    end
  end

  def html_body_from_template(template, placeholders:)
    mail_body = replace_placeholders(template.body, placeholders)

    Kramdown::Document.new(mail_body, input: "PvdKramdown").to_pvd_kramdown_email_html
  end

  def text_body_from_template(template, placeholders:)
    mail_body = replace_placeholders(template.body, placeholders)

    Kramdown::Document.new(mail_body, input: "PvdKramdown").to_pvd_kramdown_email_text
  end

  def replace_placeholders(body, placeholders)
    return "" if body.nil?

    placeholders.reduce(body) do |new_body, (placeholder, value)|
      string_value = placeholder_value_str(value)

      new_body.
        gsub(/{{\s+?#{placeholder}\s+?}}/, string_value).
        gsub(/{{-\s+?#{placeholder}\s+?}}/, "")
    end
  end

  def placeholder_value_str(value)
    return "" if value.blank?

    if attachment?(value)
      value =
        if value.respond_to?("each")
          value.map { |attachment| attachment_value(attachment) }.join(", ")
        else
          attachment_value(value)
        end
    end

    value.to_s
  end

  def attachment_value(value)
    unique_filename = attach_file(value)

    "[#{unique_filename}](#{attachments[unique_filename].url})"
  end

  def attachment?(value)
    value.respond_to?("each") && value = value[0]

    value.class.ancestors.any?(&Shrine::Attachment.method(:===))
  end

  def attach_file(attachment_record)
    return unless attachment_record&.file

    filename = attachment_record.file.original_filename

    @attachment_names ||= {}
    @attachment_names[filename] ||= {}

    existing_filename = @attachment_names[filename][attachment_record]

    return existing_filename if existing_filename.present?

    unique_filename =
      if @attachment_names[filename].present?
        filename.sub(/^([^.]+)/, "\\1(#{@attachment_names[filename].size})")
      else
        filename
      end

    @attachment_names[filename][attachment_record] = unique_filename

    attachments[unique_filename] ||= attachment_record.file.read

    unique_filename
  end
end
