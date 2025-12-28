import { spawn } from 'child_process';
import path from 'path';
export async function generateOutreach(data) {
    return new Promise((resolve, reject) => {
        const cwd = path.resolve(process.cwd(), '..', 'internscript');
        const env = { ...process.env }; // Ensure GOOGLE_API_KEY is passed
        const proc = spawn('python', ['ai_outreach.py'], {
            cwd,
            env,
            stdio: ['pipe', 'pipe', 'pipe']
        });
        let stdoutData = '';
        let stderrData = '';
        proc.stdout.on('data', (chunk) => {
            stdoutData += chunk.toString();
        });
        proc.stderr.on('data', (chunk) => {
            stderrData += chunk.toString();
        });
        proc.on('close', (code) => {
            if (code !== 0) {
                console.error('Python script error:', stderrData);
                return resolve({ status: 'error', message: `Process exited with code ${code}: ${stderrData}` });
            }
            try {
                const result = JSON.parse(stdoutData);
                resolve(result);
            }
            catch (e) {
                console.error('Failed to parse JSON:', stdoutData);
                resolve({ status: 'error', message: 'Failed to parse AI response' });
            }
        });
        // Write input data to stdin
        proc.stdin.write(JSON.stringify(data));
        proc.stdin.end();
    });
}
