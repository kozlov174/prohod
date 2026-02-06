import { query } from "../db"
import { type VisitRequest, VisitRequestStatusEnum, type VisitRequestWithForm } from "./types"

// Функции для работы с заявками на посещение

export async function getVisitRequestById(id: string): Promise<VisitRequest | null> {
  try {
    const result = await query("SELECT * FROM visit_requests WHERE id = $1", [id])
    return result.rows.length > 0 ? result.rows[0] : null
  } catch (error) {
    console.error("Error getting visit request by id:", error)
    return null
  }
}

export async function getVisitRequestWithFormById(id: string): Promise<VisitRequestWithForm | null> {
  try {
    const result = await query(
      `
      SELECT 
        vr.*,
        f.id as form_id,
        f.user_to_visit_id,
        f.passport_full_name,
        f.passport_series,
        f.passport_number,
        f.passport_who_issued,
        f.passport_issue_date,
        f.passport_photo,
        f.visit_time,
        f.visit_reason,
        f.email_to_send_reply
      FROM visit_requests vr
      JOIN forms f ON vr.form_id = f.id
      WHERE vr.id = $1
    `,
      [id],
    )

    if (result.rows.length === 0) return null

    const row = result.rows[0]
    return {
      id: row.id,
      form_id: row.form_id,
      who_processed_user_id: row.who_processed_user_id,
      who_processed_security_id: row.who_processed_security_id,
      status: row.status,
      rejection_reason: row.rejection_reason,
      form: {
        id: row.form_id,
        user_to_visit_id: row.user_to_visit_id,
        passport_full_name: row.passport_full_name,
        passport_series: row.passport_series,
        passport_number: row.passport_number,
        passport_who_issued: row.passport_who_issued,
        passport_issue_date: row.passport_issue_date,
        passport_photo: row.passport_photo,
        visit_time: row.visit_time,
        visit_reason: row.visit_reason,
        email_to_send_reply: row.email_to_send_reply,
      },
    }
  } catch (error) {
    console.error("Error getting visit request with form by id:", error)
    return null
  }
}

export async function getVisitRequestsByStatus(status: VisitRequestStatusEnum): Promise<VisitRequest[]> {
  try {
    const result = await query("SELECT * FROM visit_requests WHERE status = $1", [status])
    return result.rows
  } catch (error) {
    console.error("Error getting visit requests by status:", error)
    return []
  }
}

export async function getVisitRequestsWithFormByStatus(
  status: VisitRequestStatusEnum,
): Promise<VisitRequestWithForm[]> {
  try {
    const result = await query(
      `
      SELECT 
        vr.*,
        f.id as form_id,
        f.user_to_visit_id,
        f.passport_full_name,
        f.passport_series,
        f.passport_number,
        f.passport_who_issued,
        f.passport_issue_date,
        f.passport_photo,
        f.visit_time,
        f.visit_reason,
        f.email_to_send_reply
      FROM visit_requests vr
      JOIN forms f ON vr.form_id = f.id
      WHERE vr.status = $1
    `,
      [status],
    )

    return result.rows.map((row) => ({
      id: row.id,
      form_id: row.form_id,
      who_processed_user_id: row.who_processed_user_id,
      who_processed_security_id: row.who_processed_security_id,
      status: row.status,
      rejection_reason: row.rejection_reason,
      form: {
        id: row.form_id,
        user_to_visit_id: row.user_to_visit_id,
        passport_full_name: row.passport_full_name,
        passport_series: row.passport_series,
        passport_number: row.passport_number,
        passport_who_issued: row.passport_who_issued,
        passport_issue_date: row.passport_issue_date,
        passport_photo: row.passport_photo,
        visit_time: row.visit_time,
        visit_reason: row.visit_reason,
        email_to_send_reply: row.email_to_send_reply,
      },
    }))
  } catch (error) {
    console.error("Error getting visit requests with form by status:", error)
    return []
  }
}

export async function updateVisitRequestStatus(
  id: string,
  status: VisitRequestStatusEnum,
  processorId?: string,
  rejectionReason?: string,
): Promise<VisitRequest | null> {
  try {
    const values = [status, id]
    let query_text = `
      UPDATE visit_requests
      SET status = $1
    `

    if (processorId) {
      query_text += `, who_processed_user_id = $${values.length + 1}`
      values.push(processorId)
    }

    if (rejectionReason) {
      query_text += `, rejection_reason = $${values.length + 1}`
      values.push(rejectionReason)
    }

    query_text += ` WHERE id = $2 RETURNING *`

    const result = await query(query_text, values)
    return result.rows.length > 0 ? result.rows[0] : null
  } catch (error) {
    console.error("Error updating visit request status:", error)
    return null
  }
}

export async function createVisitRequest(visitRequest: Omit<VisitRequest, "id">): Promise<VisitRequest | null> {
  try {
    const result = await query(
      `
      INSERT INTO visit_requests (form_id, status, rejection_reason)
      VALUES ($1, $2, $3)
      RETURNING *
    `,
      [
        visitRequest.form_id,
        visitRequest.status || VisitRequestStatusEnum.not_processed,
        visitRequest.rejection_reason,
      ],
    )

    return result.rows[0]
  } catch (error) {
    console.error("Error creating visit request:", error)
    return null
  }
}
