import { NextRequest } from 'next/server'
import mongoose from 'mongoose'
import connectToDatabase from './mongodb'

export type GenerationStart = {
  concept: string
  style: string
  frameCount: number
  canvasSize: number
  background: string
  referenceImageProvided?: boolean
  route: 'generate' | 'generate-stream'
  user?: {
    id?: string
    email?: string
    planId?: string
  }
  requestMeta?: {
    ip?: string
    userAgent?: string
  }
}

export async function logGenerationStart(req: NextRequest, payload: GenerationStart) {
  try {
    await connectToDatabase()
    const db = mongoose.connection.db
    if (!db) return null

    const ipHeader = req.headers.get('x-forwarded-for') || ''
    const ip = payload.requestMeta?.ip || ipHeader.split(',')[0]?.trim() || undefined
    const userAgent = payload.requestMeta?.userAgent || req.headers.get('user-agent') || undefined

    const doc = {
      type: 'generation',
      route: payload.route,
      concept: payload.concept,
      style: payload.style,
      frameCount: payload.frameCount,
      canvasSize: payload.canvasSize,
      background: payload.background,
      referenceImageProvided: !!payload.referenceImageProvided,
      user: payload.user || {},
      plan: payload.user?.planId || 'unknown',
      request: { ip, userAgent },
      success: null as null | boolean,
      errorMessage: null as null | string,
      startedAt: new Date(),
      completedAt: null as null | Date,
      durationMs: null as null | number,
    }

    const res = await db.collection('generation_logs').insertOne(doc)
    return res.insertedId
  } catch (e) {
    console.error('logGenerationStart failed:', e)
    return null
  }
}

export async function logGenerationComplete(logId: any, success: boolean, startedAt: number | Date, errorMessage?: string) {
  try {
    if (!logId) return
    await connectToDatabase()
    const db = mongoose.connection.db
    if (!db) return

    const started = typeof startedAt === 'number' ? new Date(startedAt) : startedAt
    const durationMs = Date.now() - started.getTime()

    await db.collection('generation_logs').updateOne(
      { _id: logId },
      {
        $set: {
          success,
          errorMessage: errorMessage || null,
          completedAt: new Date(),
          durationMs,
        },
      }
    )
  } catch (e) {
    console.error('logGenerationComplete failed:', e)
  }
}
