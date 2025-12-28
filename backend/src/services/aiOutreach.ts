import { spawn } from 'child_process'
import path from 'path'
import { AIOutreachHistory } from '../models/AIOutreachHistory.js'

interface OutreachRequest {
    company_name: string
    internship_title: string
    internship_description: string
    type: 'email' | 'linkedin'
    user_notes?: string
}

interface OutreachResponse {
    status: 'success' | 'error'
    generated_content?: string
    message?: string
}

export async function generateOutreach(data: OutreachRequest): Promise<OutreachResponse> {
    return new Promise((resolve, reject) => {
        const cwd = path.resolve(process.cwd(), '..', 'internscript')
        const env = { ...process.env } // Ensure GOOGLE_API_KEY is passed

        const proc = spawn('python', ['ai_outreach.py'], {
            cwd,
            env,
            stdio: ['pipe', 'pipe', 'pipe']
        })

        let stdoutData = ''
        let stderrData = ''

        proc.stdout.on('data', (chunk) => {
            stdoutData += chunk.toString()
        })

        proc.stderr.on('data', (chunk) => {
            stderrData += chunk.toString()
        })

        proc.on('close', (code) => {
            if (code !== 0) {
                console.error('Python script error:', stderrData)
                return resolve({ status: 'error', message: `Process exited with code ${code}: ${stderrData}` })
            }

            try {
                console.log('Python Output:', stdoutData);
                const result = JSON.parse(stdoutData)
                if (result.status === 'error') {
                    console.error('AI Service Error:', result.message);
                }
                resolve(result)
            } catch (e) {
                console.error('Failed to parse JSON:', stdoutData)
                resolve({ status: 'error', message: 'Failed to parse AI response' })
            }
        })

        // Write input data to stdin
        proc.stdin.write(JSON.stringify(data))
        proc.stdin.end()
    })
}
